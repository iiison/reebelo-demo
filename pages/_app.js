import React from 'react';

import Header from '../components/Header/Header'
import styles from '../styles/globals.module.css'

function MyApp({ Component, pageProps }) {
  return <div className={`${styles.root} grid`}> <Header /><Component {...pageProps} /></div>
}

export default MyApp
