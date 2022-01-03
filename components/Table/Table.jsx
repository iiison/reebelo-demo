import React from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

export default function Table({
  map,
  rows,
  headers,
  formatter,
  onRowClick,
  highlightRows
}) {
  return (
    <table className={`${styles.striped} col-12 t-center`}>
      <thead>
        <tr>
          {headers.map(({ display_name, name }) => (
            <th key={name} className='padded-s t-capitalize'>{display_name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {
          rows.map((row, rowId) => (
            <tr key={row} onClick={onRowClick({ rowId })} className={`${highlightRows.includes(rowId) && styles.highlighted}`}>
              {
                map[row].map((value, index) => (
                  <td key={value}>
                    <div
                      className={`col-12 grid-center grid-middle`}
                    >
                      {formatter(headers[index].format_hint, value)}
                    </div>
                  </td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

Table.propTypes = {
  formatter     : PropTypes.func,
  onRowClick    : PropTypes.func,
  map           : PropTypes.object,
  highlightRows : PropTypes.arrayOf(PropTypes.number),
  rows          : PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  headers       : PropTypes.arrayOf(PropTypes.shape({
    display_name : PropTypes.string,
    format_hint  : PropTypes.string,
    name         : PropTypes.string,
    type         : PropTypes.string
  }))
}
