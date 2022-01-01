import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PropTypes } from 'prop-types'
import { useDispatch } from 'react-redux'

import {
  Loader,
  PinInputUnit,
  Timer,
} from '$COMPONENTS'
import errorTypeDetailMap from '$CONFIGS/errorTypeDetailMap'
import { ShowIcon, HideIcon } from '$COMPONENTS/icons/index';
import { setPinFailure } from '$RMODULES/pin/pin'
import { useSetState } from '$UTILS/reactUtils'

import styles from './styles.css'

const handleInputChange = ({ setPin, setValidationError, dispatch, error }) => (index) => (event) => {
  event.persist()
  const val = event.currentTarget.value

  if (error) {
    dispatch(setPinFailure(''))
    setValidationError('')
  }

  setPin({ [index]: val })
}

const handleKeyUp = (setFocus) => (index) => (event) => {
  event.persist()

  const { keyCode } = event

  if (keyCode && keyCode >= 48 && keyCode <= 57 && index !== 3) {
    setFocus(index + 1)
  }

  if (keyCode && keyCode === 8 && index !== 0) {
    setFocus(index - 1)
  }
}

const handlePinToggle = (type, setType) => (event) => {
  event.preventDefault();

  if (type === 'tel')
    setType('password');
  else
    setType('tel')
}

const handleSubmit = ({ tries, onSubmitProp, pinState, setValidationError }) => () => {
  if (!pinState) {
    setValidationError('Pin is invalid.')

    return
  }

  const pin = pinState.join('')

  if (pin && pin.length === 4) {
    setValidationError('')
    onSubmitProp(pin, tries)

    return
  }
  setValidationError('Pin is invalid.')
}

const chooseLoaderMessage = ({ loadingMessage, timeout,  }) => {
  if (timeout === 0) {
    return 'Operation timed out.'
  }

  return loadingMessage
}

const PinComponent = ({
  error,
  tries,
  heading,
  onSubmit,
  skipText,
  subHeading,
  helperText,
  isFetching,
  isVerified,
  loadingMessage,
  onSkip : onSkipProp
}) => {
  const [pin, setPin] = useSetState()
  const [timeout, setUserTimeout] = useState()
  const [type, setType] = useState('password')
  const [validationError, setValidationError] = useState('')
  const [focusedInput, setFocusedInput] = useState(0)

  const dispatch = useDispatch()

  const onSkip = (reason) => {
    setUserTimeout(0)
    onSkipProp(reason)
  };

  let configs = useSelector(({ configs }) => configs)
  let errorMessage

  if (error) {
    errorMessage = error.includes(' ') ? error : errorTypeDetailMap[error] || errorTypeDetailMap.generic
  }

  const pageErrors = validationError || errorMessage
  const handleInputChangeWithState = handleInputChange({ setPin, setValidationError, dispatch, error : pageErrors })
  const handlePinToggleWithState = handlePinToggle(type, setType)
  const handleKeyUpWithState = handleKeyUp(setFocusedInput)
  const handleFormSubmit = handleSubmit({
    tries,
    onSubmitProp : onSubmit,
    pinState : Object.values(pin),
    setValidationError
  })
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  useEffect(() => {
    if (focusedInput !== undefined && inputRefs[focusedInput].current) {
      inputRefs[focusedInput].current.focus()
    }
  }, [focusedInput])

  return (
    <div className={`${styles.pinComponent}`}>
      <div className={`grid col-12 t-center`}>
        <h1 className={`col-12 t-capitalize ${styles.heading1}`}>{heading}</h1>
        <h2 className={`col-12 t-capitalize ${styles.heading2}`}>{subHeading}</h2>
        <div className={`col-12 grid-center grid-middle ${styles.inputComponent} ${error && styles.pinError}`}>
          {
            Array(4).fill().map((val, index) => {
              const props = {
                refVal : inputRefs[index],
                value : pin[index],
                type : type,
                events : {
                  onChange : handleInputChangeWithState(index),
                  onKeyUp : handleKeyUpWithState(index)
                }
              }

              return <PinInputUnit key={index} {...props} />
            })
          }
          <a
            href='#'
            className={`${styles.visibilityToggle}`}
            onClick={handlePinToggleWithState}
          >
            <img src={type === 'tel' ? HideIcon : ShowIcon} />
          </a>
        </div>
        {pageErrors ?
          <p className={`col-12 ${styles.error}`}>{pageErrors}</p> :
          <p className={`col-12 ${styles.helperText}`}>{helperText}</p>
        }

        <div className={`col-12 grid-center`}>
          <button type='button'
            disabled={Object.values(pin).join('').length === 4 ? false : true || isFetching}
            className={`${styles.button} margin-top-s`}
            onClick={handleFormSubmit}>
            {isFetching ? 'VERIFYING' : 'CONFIRM'}
          </button>
        </div>

        {configs.pinView === 'VERIFY' && <Timer seconds={configs.webResourceThresholdTime * 60} onSkip={onSkip} />}

        <a href='#' onClick={onSkip} className={`col-12 ${styles.skipFlow}`}>{skipText}</a>
        {
          (isFetching === true || isVerified === true) && 
            <Loader
              message={chooseLoaderMessage({ loadingMessage, timeout })}
              success={isVerified}
            />
        }
      </div>
    </div>
  )
}

PinComponent.propTypes = {
  heading        : PropTypes.string.isRequired,
  subHeading     : PropTypes.string.isRequired,
  onSubmit       : PropTypes.func.isRequired,
  onSkip         : PropTypes.func.isRequired,
  error          : PropTypes.string,
  helperText     : PropTypes.string,
  skipText       : PropTypes.string,
  isFetching     : PropTypes.bool,
  loadingMessage : PropTypes.string,
  timer          : PropTypes.string,
  tries          : PropTypes.number,
  isVerified     : PropTypes.bool
}

export default PinComponent
export {
  handleInputChange,
  handleSubmit,
  handleKeyUp
}

