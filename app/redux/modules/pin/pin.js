import store from '$CONFIGS/store'
import { post } from '$UTILS/requestHandler'
import {
  makeReducer,
  makeActions
} from '$RUTILS/reduxUtils'

const SET_PIN = 'SET_PIN'
const UPDATE_TRIES_COUNT = 'UPDATE_TRIES_COUNT'
const {
  defaultAction: setPin,
  successAction: setPinSuccess,
  failureAction: setPinFailure,
} = makeActions(SET_PIN)

// Sync Action Creator
export function updateTriesCount() {
  return {
    type: UPDATE_TRIES_COUNT
  }
}
// **********************************************
function makePayloadForAndroid(response) {
  if (!response) {
    return
  }

  const shellResponse = {
    data: {
      webViewResponse: {
        token: undefined,
        showWebView: false
      },
      webViewError: {
        errorCode: undefined
      }
    }
  }
  const { status, data } = response

  if (status) {
    shellResponse.data.webViewError.errorCode = status.respCode
  }

  if (data) {
    shellResponse.data.webViewResponse.token = data.idToken
  }

  return shellResponse
}

function sendDataToAndroid(status, data) {
  const stringifiedData = JSON.stringify(data)

  if (window.VisaSafeClickHandler && window.VisaSafeClickHandler.vscPinWebviewResponseHandler) {
    window.VisaSafeClickHandler.vscPinWebviewResponseHandler(status, stringifiedData)
  }
}

export function addPVVToPayload() {
  const { configs : { pvv } } = store.getState()

  if (window.VisaSafeClickHandler && window.VisaSafeClickHandler.encryptPVV) {
    return {
      pvv : window.VisaSafeClickHandler.encryptPVV(pvv)
    }
  }

  return {}
}

// Async Action Creators Starts
export function triggerSetPin({
  pin,
  deviceId,
  previousPin,
  accountReferenceId,
  additionalPayLoad = {}
}) {
  return async (dispatch) => {
    dispatch(setPin())

    try {
      const payload = {
        pin,
        accountReferenceId,
        ...additionalPayLoad,
        ...addPVVToPayload(),
        confirmPin : previousPin,
        apiAction  : 'SUBMIT'
      }

      if (pin === undefined) {
        payload.apiAction = 'CANCEL'
      }

      const response = await post({
        payload,
        path: `v1/devices/${deviceId}/pin/set`,
      })

      if (response.status && response.status.respCode) {
        dispatch(setPinFailure(response.status.respCode))
      } else {
        dispatch(setPinSuccess(response))
      }

      sendDataToAndroid(response.httpStatus, makePayloadForAndroid(response))
    } catch (error) {
      dispatch(setPinFailure(error.message || error))
    }
  }
}

export function triggerVerifyPin({
  pin,
  deviceId,
  accountReferenceId,
  additionalPayLoad = {}
}) {
  const verifyPin = setPin
  const verifyPinSuccess = setPinSuccess
  const verifyPinFailure = setPinFailure

  return async (dispatch) => {
    dispatch(verifyPin())

    try {
      const payload = {
        pin,
        accountReferenceId,
        ...addPVVToPayload(),
        ...additionalPayLoad,
        apiAction: 'SUBMIT'
      }

      if (pin === undefined) {
        payload.apiAction = 'CANCEL'
        // delete payload.pin
      }

      const response = await post({
        payload,
        path: `v1/devices/${deviceId}/pin/verify`,
      })

      if (response.data) {
        dispatch(verifyPinSuccess(response))
        sendDataToAndroid(response.httpStatus, makePayloadForAndroid(response))

        return
      } else if (response.status && response.status.respCode && response.status.respCode !== '200') {
        dispatch(verifyPinFailure(response.status.respCode))
      }

      // if (pin !== undefined) {
      //   dispatch(verifyPinSuccess(response))
      // } 

      if (!response.status.respCode.includes('VCOL_0025')) {
        sendDataToAndroid(response.httpStatus, makePayloadForAndroid(response))
      }
    } catch (error) {
      dispatch(verifyPinFailure(error.message || error))

      // window.AndroidHandler.closeActivity()
    }
  }
}
// **********************************************

export const initialState = {
  isFetching: false,
  isVerified: false,
  error: '',
  tries: 0
}

const pin = makeReducer({
  actionName: SET_PIN,
  initialState,
  additionalActions(state) {
    return {
      UPDATE_TRIES_COUNT: () => ({
        ...state,
        tries: state.tries + 1
      })
    }
  }
})

export default pin
export {
  setPin,
  setPinFailure,
  setPinSuccess,
}

