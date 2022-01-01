import React from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { PinComponent } from '$COMPONENTS'
import { setPinSuccess, triggerSetPin } from '$RMODULES/pin/pin'

const handleSubmit = ({ dispatch, history }) => (pin) => {
  if (!pin) {
    throw new Error('Please pass pin.')
  }

  if (!dispatch) {
    throw new Error('Please pass dispatch.')
  }

  if (!history) {
    throw new Error('Please pass history from react-router.')
  }

  dispatch(setPinSuccess(pin))
  history.push('/enrollment/setPin')
}

const Step1 = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const additionalPayLoad = {
    pinCancelReason : 'USER_CANCELLED'
  }

  const {
    deviceId,
    panLast4digits,
    accountReferenceId
  } = useSelector(({ configs }) => configs)
  const { isFetching } = useSelector(({ pin }) => pin)

  const props = {
    isFetching,
    loadingMessage : 'Processing...',
    heading        : 'create your pin',
    subHeading     : `enabling faster payments on your Visa **** ${panLast4digits}`,
    onSubmit       : handleSubmit({ dispatch, history }),
    skipText       : `Skip this step`,
    onSkip         : () => dispatch(triggerSetPin({ accountReferenceId, deviceId, additionalPayLoad })),
    helperText     : `Pay securely with a PIN for orders up to ₹2,000`
  }

  return (
    <div>
      <PinComponent {...props} />
    </div>
  )
}

export default Step1
export {
  handleSubmit
}

