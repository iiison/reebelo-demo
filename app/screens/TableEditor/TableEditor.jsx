import React, { useState, useEffect } from 'react'
import { PropTypes } from 'prop-types'

import { Table } from '$COMPONENTS'
import tableDataFormatter from './tableDataFormatter'
import EditorForm from './EditorForm'

function fetchTable(id) {
  return {
    hash : 'not_used',
    data : {
      headers : [ 
        {
          name : 'col-1',
          display_name : 'col-1',
          type : 'decimal',
          format_hint : 'int'
        },
        {
          name : 'col-2',
          display_name : 'col-2',
          type : 'currency',
          format_hint : 'float'
        },
        {
          name : 'col-3',
          display_name : 'col-3',
          type : 'date',
          format_hint : 'date'
        }
      ],
      rows : [
        ['123', '32.32', '1234123'],
        ['123', '32', '1234123'],
        ['123', '32.32', '1234123'],
        ['123', '32.32', 1639978847],
      ]
    }
  }
}

function Modal({ row, headers, rowId }) {
  return (
    <div>Modal</div>
  )
} 

Modal.propTypes = {
  rowId   : PropTypes.number,
  row     : PropTypes.arrayOf(PropTypes.number),
  headers : PropTypes.arrayOf(PropTypes.shape({
    display_name : PropTypes.string,
    format_hint  : PropTypes.string,
    name         : PropTypes.string,
    type         : PropTypes.string
  }))
}

function handleRowClick(setShowModal, setCurrentRow) {
  return ({ rowId }) => () => {
    setShowModal(true)
    setCurrentRow(rowId)
  }
}

function makeTableDataMap(data) {
  return data.reduce((map, row, currIndex) => ({
    ...map,
    [currIndex] : row
  }), {})
}

function handleRowSave({
  currentRow,
  setShowModal,
  tableDataMap,
  setEditedRows,
  setTableDataMap
}) {
  return (rowData) => {
    const dataClone = {...tableDataMap}
    setShowModal(false)

    dataClone[currentRow] = [...Object.values(rowData)]
    setTableDataMap(dataClone)
    setEditedRows((prev) => [...prev, currentRow])
  }
}

export default function TableEditor() {
  const [ showModal, setShowModal ] = useState(false)
  const [ tableDataMap, setTableDataMap ] = useState()
  const [ tableHeaders, setTableHeaders ] = useState([])
  const [ tableHash, setTableHash ] = useState([])
  const [ activeRows, setActiveRows ] = useState([])
  const [ currentRow, setCurrentRow ] = useState()
  const [ editedRows, setEditedRows ] = useState([])

  useEffect(() => {
    const {
      hash,
      data : { headers, rows : data }
    } = fetchTable()

    const rowsMap = makeTableDataMap(data)
    setTableDataMap(rowsMap)
    setTableHeaders(headers)
    setTableHash(hash)
    setActiveRows(Object.keys(rowsMap))
  }, [])

  return (
    tableDataMap === undefined
    ? <h2>No Data</h2>
    : (
      <div className='grid col-12'>
        <Table
          rows={activeRows}
          map={tableDataMap}
          headers={tableHeaders}
          highlightRows={editedRows}
          formatter={tableDataFormatter}
          onRowClick={handleRowClick(setShowModal, setCurrentRow)}
        />
        {showModal && (
          <EditorForm
            headers={tableHeaders}
            row={tableDataMap[currentRow]}
            onSave={handleRowSave({
              currentRow,
              tableHeaders,
              setShowModal,
              tableDataMap,
              setEditedRows,
              setTableDataMap
            })} 
          />
          )
        }
      </div> 
    )
  )
}
