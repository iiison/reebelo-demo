import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

function handleInputChange(setValue) {
  return (event) => {
    event.persist()

    setValue(event.target.value)
  }
}

export default function TextInput({
  label,
  onChange,
  type = 'text',
  classes = '',
  placeholder = '',
  value : propValue = ''
}) {
  const [value, setValue] = useState(propValue)
  const inputProps = {
    type,
    value,
    placeholder
  }

  useEffect(() => onChange(value), [value])

  return (
    <div className={`grid-middle col-12 ${classes}`}>
      {label && (<div className='label col-12 margin-bottom-s'>{label}</div>)}
      <input
        className={`col-12 ${styles.input}`}
        {...inputProps}
        onChange={handleInputChange(setValue)}
      />
    </div>
  )
}

TextInput.propTypes = {
  value       : PropTypes.string,
  label       : PropTypes.string.isRequired,
  classes     : PropTypes.string,
  onChange    : PropTypes.func.isRequired,
  placeholder : PropTypes.string,
  type        : PropTypes.oneOf(['email', 'text', 'number', 'tel', 'password', 'textarea'])
}
