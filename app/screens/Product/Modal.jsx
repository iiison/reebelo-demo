import React from 'react'
import { PropTypes } from 'prop-types'

import styles from './styles.css'

const Modal = ({ onClick }) => {
  return (
    <div className={`${styles.modal} grid-middle grid-center`} onClick={onClick}>
      <div className={`${styles.content} padded-l col-8`}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
    </div>
  )
}

Modal.propTypes = {
  onClick: PropTypes.func
}

export default Modal
