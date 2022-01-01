import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'

function handleOptionsChange(setValues) {
  return (event) => {
    event.persist()

    const { checked, value } = event.target

    if (checked === true) {
      setValues((prevValues) => [ ...prevValues, value ])
    } else if (checked === false) { 
      setValues((prevValues) => prevValues.filter(val => val === value ? false : true))
    }
  }
}

export default function Options({
  label,
  options,
  onChange,
  value : propValue,
  classes = ''
}) {
  const [value, setValues] = useState(propValue || [])

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <div className={`select-box grid col-12 ${classes}`}>
      <div className='label col-12 margin-bottom-s t-capitalize'>{label}</div>
      <div className='col-12 padded-s'>
        <div className='grid'>
          {
            options.map(({ name, value }) => (
              <div className='col-12 margin-bottom-l' key={name}>
                <div className='grid-middle'>
                  <input
                    id={value}
                    type='checkbox'
                    value={value}
                    className='margin-right-s'
                    onChange={handleOptionsChange(setValues)}
                  />
                  <label htmlFor={value}>
                    {name}
                  </label>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

Options.propTypes = {
  options  : PropTypes.arrayOf(PropTypes.shape({
    value : PropTypes.string,
    name  : PropTypes.string
  })).isRequired,
  label    : PropTypes.string.isRequired,
  classes  : PropTypes.string,
  value    : PropTypes.string,
  onChange : PropTypes.func
}
