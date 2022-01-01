import React from 'react'
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

import { PinComponent } from '$COMPONENTS'
import {
  setPinFailure,
  triggerSetPin, updateTriesCount } from '$RMODULES/pin/pin'

const handleSubmit = ({
  history,
  dispatch,
  deviceId,
  previousPin,
  maxPinAttempts,
  accountReferenceId
}) => (pin, tries = 0) => {
  if (!pin) {
    throw new Error('Please pass pin.')
  }

  if (!dispatch) {
    throw new Error('Please pass dispatch.')
  }

  if (!history) {
    throw new Error('Please pass history from react-router.')
  }

  dispatch(updateTriesCount())

  if (pin === previousPin || tries > maxPinAttempts) {
    dispatch(triggerSetPin({
      pin,
      deviceId,
      previousPin,
      accountReferenceId,
    }))
  } else {
    dispatch(setPinFailure('Pin do not match. Please enter again.'))
  }
}

const Step2 = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const additionalPayLoad = {
    pinCancelReason : 'USER_CANCELLED'
  }

  const {
    error,
    tries,
    isFetching,
    response : previousPin,
  } = useSelector(({ pin }) => pin)
  const { maxPinAttempts } = useSelector(({ configs }) => configs)

  const {
    accountReferenceId,
    deviceId,
    panLast4digits
  } = useSelector(({ configs }) => configs)

  if (!previousPin) {
    history.goBack()
  }


  const props = {
    error,
    tries,
    isFetching,
    heading        : 'Re-enter PIN',
    skipText       : `Skip this step`,
    loadingMessage : 'Enabling faster payments',
    helperText     : `Pay securely with a PIN for orders up to ₹2,000`,
    subHeading     : `Enabling faster payments on your Visa **** ${panLast4digits}`,
    onSubmit       : handleSubmit({ dispatch, history, previousPin, accountReferenceId, deviceId, maxPinAttempts }),
    onSkip         : (pinCancelReason = 'USER_CANCELLED') => dispatch(triggerSetPin({
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

export default Step2
export { handleSubmit }

