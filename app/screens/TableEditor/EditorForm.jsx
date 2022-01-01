import React, { useRef } from 'react'
import moment from 'moment'
import { PropTypes } from 'prop-types'

import { Options, TextInput } from '$COMPONENTS'
import styles from './styles.css'

function handleTimeChange(value) {
  return moment(`01/01/2000 ${value}`, 'D/M/YYYY').unix()
}

function handleDateChange(value) {
  return moment(value, 'D/M/YYYY').unix()
}

function handleInputChange(formData, key, formatter) {
  return (value) => {
    formData.current = {
      ...formData.current,
      [key] : formatter ? formatter(value) : value
    }
  }
}

function returnComponentByType({ type, display_name, name }, value, formData) {
  const normalizedType = type.toLowerCase()

  switch (normalizedType) {
    case 'boolean':
      return (
        <Options
          label={display_name} 
          options={[{ name : 'yes', value }]}
          onChange={handleInputChange(formData, name)}
        />
      )

    case 'date':
      return (
        <TextInput
          label={display_name}
          placeholder={'DD/MM/YYYY'}
          value={moment.unix(value).format('DD/MM/YYYY')}
          onChange={handleInputChange(formData, name, handleDateChange)}
        />
      )

    case 'time':
      return (
        <TextInput
          label={display_name}
          placeholder={'HH:MM:SS'}
          value={moment.unix(value).format('HH:mm:ss')}
          onChange={handleInputChange(formData, name, handleTimeChange)}
        />
      )

    case 'int':
    case 'float':
    case 'string':
    default:
      return (
        <TextInput
          value={value}
          label={display_name}
          onChange={handleInputChange(formData, name)}
        />
      )
  }
}

function handleSave(formData, callback) {
  return () => {
    if (callback) {
      callback(formData.current)
    }
  }
}

export default function EditorForm({ row, headers, onSave }) {
  const formData = useRef({})

  return (
    <div className={`${styles.modal}`}>
      <div className={`grid-middle grid-center ${styles.modalWrap}`}>
        <div className={`${styles.modalCont} padded-l normal-color`}>
          <h1 className='t-center margin-bottom-s'>Edit Row</h1>
          <div className='grid'>
            {row.map((value, index) => (
              <div className='col-12 margin-bottom-l t-capitalize' key={value}>
                {returnComponentByType(headers[index], value, formData)}
              </div>
            ))}
            <button
              onClick={handleSave(formData, onSave)}
              className={`${styles.btn} col-12 margin-tb-xl padded-l pointer`}
            >Update Table</button>
          </div>
        </div>
      </div>
    </div>
  )
}

EditorForm.propTypes = {
  onSave  : PropTypes.func,
  row     : PropTypes.arrayOf(PropTypes.number),
  headers : PropTypes.arrayOf(PropTypes.shape({
    display_name : PropTypes.string,
    format_hint  : PropTypes.string,
    name         : PropTypes.string,
    type         : PropTypes.string
  }))
}
