import React from 'react'
import { PinComponent } from '$COMPONENTS'
import { useDispatch, useSelector } from 'react-redux'
import { triggerVerifyPin } from '$RMODULES/pin/pin'

const PinVerification = () => {
  const dispatch = useDispatch()

  const {
    error,
    isFetching,
  } = useSelector(({ pin }) => pin)

  const {
    accountReferenceId,
    deviceId,
    panLast4digits
  } = useSelector(({ configs }) => configs)

  const additionalPayLoad = {
    pinCancelReason : 'USER_CANCELLED'
  }

  const props = {
    error,
    isFetching,
    heading        : 'Enter your PIN',
    subHeading     : `Paying with faster payments on your Visa **** ${panLast4digits}`,
    helperText     : `Pay securely with a PIN for orders up to ₹2,000`,
    skipText       : `Pay with OTP instead`,
    loadingMessage : `Verifying details`,
    onSubmit       : (pin) => dispatch(triggerVerifyPin({ pin, accountReferenceId, deviceId })),
    onSkip         : (pinCancelReason = 'USER_CANCELLED') => dispatch(triggerVerifyPin({
      accountReferenceId,
      deviceId,
      additionalPayLoad : {
        ...additionalPayLoad,
        pinCancelReason
      }
    })),
  }

  return (
    <div>
      <PinComponent {...props} />
    </div>
  )
}

export default PinVerification

