import { makeReducer } from '$RUTILS/reduxUtils'

let initState;

if (window.initializePinFlowResponse) {
    initState = { ...window.initializePinFlowResponse }
} else {
  // TODO : Only for local, remove it before moving to PROD
  initState = {
    pinView                  : 'ENROLL',
    accountReferenceId       : '6b31f8f01b8dbbd80e1e8fd13c7eb91fa7e332d2583aa801',
    maxPinAttempts           : 3,
    webResourceThresholdTime : '3',
    deviceId                 : '1e537561e16a64204139e4c11819c8f0c7aec84cf294d601',
    panLast4digits           : '1234'
  }
}

export const initialState = initState
const configs = makeReducer({ initialState })

export default configs;

