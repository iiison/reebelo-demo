import React, { useState, useEffect }  from 'react'
import Image from 'next/image'

import Select from '../../components/Select/Select'

import Modal from './modal'
import styles from './styles.module.css'

function getMockProducts() {
  return {
    name : 'Awesome Product',
    price : 3332.99,
    availability : 'in-stock',
    desc : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    meta : [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      'Integer feugiat scelerisque varius morbi enim nunc faucibus a.',
      'Vitae tortor condimentum lacinia quis vel.',
      'Commodo ullamcorper a lacus vestibulum sed arcu. Eget dolor morbi non arcu risus quis.'
    ],
    deliveryOptions : [
      'Standard delivery',
      'Express delivery',
      'Something else'
    ]
  }
}

const Product = () => {
  const [ product, setProduct ] = useState({})
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const apiResponse = getMockProducts()

    setProduct(apiResponse)
  }, [])

  return (
    product && product.name
    ? (
      <div className='col-12 padded-l'>
        <main
          className='col-12 grid'
          itemScope
          itemType='http://schema.org/Product'
        >
          <div className='col-12 grid'>
            <div className={`col-6_sm-12 grid-middle grid-center ${styles.imgCont}`}>
              <Image
                alt={product.name}
                itemProp='image'
                src={`https://via.placeholder.com/400/000000/FFFFFF/?text=${product.name}`}
              />
            </div>
            <div className='col-6_sm-12 grid-top'>
              <h1
                itemProp='name'
                className='col-12 margin-tb-s'
              >{product.name}</h1>
              <p itemProp='description' className={`col-12`}>{product.desc}</p>
              <section
                className={`col-12 ${styles.price} margin-tb-l`}
                itemScope
                itemProp='offers'
                itemType='http://schema.org/Offer'
              >
                <meta itemProp='priceCurrency' content='USD' />
                <p className='col-12 grid-middle'>
                  <h3 itemProp='price' className='dollar'>{product.price}&nbsp;</h3>
                  (<span itemProp='availability'>{product.availability}</span>)
                </p>
              </section>
              <section
                className={`${styles.meta} col-12 margin-tb-l`}
                itemScope
                itemProp='additionalProperty'
                itemType='https://schema.org/PropertyValue'
              >
                <ul className='col-12 grid'>
                  {product.meta.map(meta => <li key={meta} itemProp='value' className='col-12'>{meta}</li>)}
                </ul>
              </section>
              <div className='col-12 grid-spaceBetween grid-middle'>
                <div className='col-6_md-7'>
                  <Select
                    onChange={()=>{}}
                    placeholder='Choose Delivery Options'
                    options={product.deliveryOptions}
                  />
                </div>
                <button 
                  onClick={() => setShowModal(true)}
                  className={`btn ${styles.button} margin-tb-l padded-l col-4`}
                >Buy Now</button>
              </div>
            </div>
          </div>
        </main>
        {showModal && <Modal onClick={() => setShowModal(false)}/>}
      </div>
    ) : (
      <p>Loading...</p>
    )
  )
}

export default Product

