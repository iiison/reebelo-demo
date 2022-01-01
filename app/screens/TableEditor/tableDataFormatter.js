import React from 'react'
import moment from 'moment'

export default function tableDataFormatter(name, value) {
  const normalizedName = name.toLowerCase()

  switch (normalizedName) {
    case 'int':
      return <span>{parseInt(value, 10)}</span>

    case 'float':
      return <span>{(Math.round(parseFloat(value) * 100) / 100).toFixed(2)}</span>

    case 'string':
      return <span>{value}</span>

    case 'boolean':
      return <span>{value === true ? 'yes' : 'no'}</span>

    case 'date':
      return <span>{moment.unix(value).format('DD/MM/YYYY')}</span>

    case 'time':
      return <span>{moment.unix(value).format('HH:mm:ss')}</span>

    default:
      return <span>{value}</span>
  }
}
