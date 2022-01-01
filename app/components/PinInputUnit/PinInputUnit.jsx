import React from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

const PinInputUnit = ({
  refVal,
  events = {},
  value = '',
  type = 'tel',
  // classes = '',
}) => {
  // TODO: Need to change type from  tel to password on focusout
  return (
    <input
      {...events}
      ref={refVal}
      type={type}
      min={0}
      max={9}
      maxLength={1}
      value={value}
      className={`t-center ${styles.pinInput}`}
    />
  )
}

PinInputUnit.propTypes = {
  events: PropTypes.shape({
    onFocus: PropTypes.func,
    onKeyUp: PropTypes.func,
    onBlur: PropTypes.func,
    onChange: PropTypes.func.isRequired
  }),
  refVal: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any })
  ]).isRequired,
  value: PropTypes.string,
  classes: PropTypes.string,
  type: PropTypes.string
}

export default PinInputUnit

