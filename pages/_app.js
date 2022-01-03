import React from 'react';
import { PropTypes } from 'prop-types'

import Header from '../components/Header/Header'
import styles from '../styles/globals.module.css'

function MyApp({ Component, pageProps }) {
  return <div className={`${styles.root} grid`}> <Header /><Component {...pageProps} /></div>
}

MyApp.propTypes = {
  Component: PropTypes.element,
  pageProps: PropTypes.object
}

export default MyApp
