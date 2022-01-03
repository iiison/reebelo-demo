import React, { useState } from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'


export default function Select({
  value,
  label,
  classes = '',
  options,
  onChange,
  placeholder = 'select value'
}) {
  const [ fieldValue, setFieldValue ] = useState(value)
  const handleChange = (optionValue) => () => {
    setFieldValue(optionValue)
    onChange && onChange(optionValue)
  }

  return (
    <div className={`select-box grid col-12 ${classes}`}>
      {label && (<div className='label col-12 margin-bottom-s'>{label}</div>)}
      <div className={`col-12 relative ${styles.select} pointer`}>
        <div className='grid col-12 t-capitalize'>{fieldValue ? fieldValue : placeholder}</div>
        <div className={`grid col-12 ${styles.options}`}>
          {
            options.map((option) => (
              <div
                key={option.id || option.display || option}
                className={`col-12 ${styles.option}`}
                onClick={handleChange(option.id || option)}
              >
                <div className='grid'>{option.display || option}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

Select.propTypes = {
  id          : PropTypes.string.isRequired,
  options     : PropTypes.arrayOf(PropTypes.shape([PropTypes.string])),
  label       : PropTypes.string,
  value       : PropTypes.string,
  classes     : PropTypes.string,
  placeholder : PropTypes.string,
  onChange    : PropTypes.func
}
