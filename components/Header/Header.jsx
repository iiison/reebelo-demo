import React from 'react';
import Link from 'next/link'

import styles from './styles.module.css'

const Header = () => { 
  return ( 
    <header className={`col-12 t-left padded-l ${styles.header}`}>
      <Link href='/' passHref>
        <h1 className='header-color'>Demo</h1>
      </Link>
    </header>
  )
}

export default Header
