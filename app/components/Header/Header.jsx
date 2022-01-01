import React from 'react';

import styles from './styles.css'

const Header = () => { 
  return ( 
    <header className={`col-12 t-left padded-l ${styles.header}`}>
      <h1 className='header-color'>Demo</h1>
    </header>
  )
}

export default Header
