import React, { useState, useEffect }  from 'react'
import Image from 'next/image'

import Select from '../../components/Select/Select'
import DocumentHead from '../../components/DocumentHead/DocumentHead'

import Modal from './modal'
import styles from './styles.module.css'

function getMockProduct() {
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

const Product = ({ prod = {} }) => {
  const [ product, setProduct ] = useState(prod)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (product.name !== undefined) {
      return 
    }

    const apiResponse = getMockProduct()

    setProduct(apiResponse)
  }, [])

  const docHeadProps = {
    title       : product.name,
    description : product.desc,
    img         : `/400/000000/FFFFFF/?text=${product.name}`
  }

  return (
    product && product.name
    ? (
      <div className='col-12 padded-l'>
        <DocumentHead {...docHeadProps} />
        <main
          className='col-12 grid'
          itemScope
          itemType='http://schema.org/Product'
        >
          <div className='col-12 grid'>
            <div className={`col-6_sm-12 grid-middle grid-center ${styles.imgCont}`}>
              <Image
                itemProp='image'
                alt={product.name}
                className={styles.img}
                layout='fill'
                src={`/400/000000/FFFFFF/?text=${product.name}`}
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
                  <span itemProp='price' className={`dollar ${styles.price}`}>{product.price}&nbsp;</span>
                  <span itemProp='availability' className={`t-capitalize`}>
                    ({product.availability})
                  </span>
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
                    id='Delivery-Opts'
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

export const getServerSideProps = ({ params }) => {
  return {
    props : {
      prod : getMockProduct()
    }
  }
}
export default Product

