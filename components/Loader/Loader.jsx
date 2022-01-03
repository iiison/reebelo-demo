import React from 'react'
import Image from 'next/image'
import { PropTypes } from 'prop-types'

import { VisaSuccessLogo } from '$COMPONENTS/icons/index';
import * as styles from './styles.css'

const Loader = ({ message = 'Loading...', success }) => {
  return (
    <div className={`${styles.loader} grid-middle grid-center`}>
      {success ? (<div className='grid-center'>
        <Image className={`${styles.successLogo}`} src={VisaSuccessLogo} alt='success' />
      </div>) :
        <div className='grid-center'>
          <div className={styles.loaderCont}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          <span className='col-12 grid-center t-capitalize'>{message}</span>
        </div>
      }
    </div>
  )
}

Loader.propTypes = {
  message: PropTypes.string,
  success: PropTypes.bool
}


export default Loader
