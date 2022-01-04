import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import DocumentHead from '../components/DocumentHead/DocumentHead'

import dummyProds from './mockProds.json'
import styles from './styles.module.css'

function getMockProducts() {
  return dummyProds 
}

function renderProducts({ products }) {
  return (
    <section className='col-12 padded-l' id='products'>
      <div className='grid'>
        <ul className='grid col-12'>
          {products.map(({ name, desc, price, id }) => (
            <li
              className={`col-3_md-4_sm-12 padded-s`}
              key={name}
            >
              <Link href={`/products/${id}`} className='normal-color grid' passHref>
                <article
                  itemScope
                  itemType='http://schema.org/Product'
                  className={`grid col-12 ${styles.productCont}`} id={id}
                >
                  <div className='col-12 padded-s'>
                    <div className='grid-center'>
                      <div className={`col-12 grid-middle grid-center ${styles.prodImg}`}>
                        <Image
                          alt={name}
                          itemProp='image'
                          className={styles.img}
                          src={`/250/000000/FFFFFF/?text=${name}`}
                          layout='fixed'
                          width='100%'
                          height='100%'
                        />
                      </div>
                      <h2 itemProp='name' className={`col-12 ${styles.prodName}`}>{name}</h2>
                      <p itemProp='description' className={`${styles.smalls} col-12`}>{desc}</p>
                      <p className={`dollar col-12 margin-top-s`}><data value={price}>{price}</data></p>
                    </div>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const useProductsState = (initialState = []) => {
  const [ products, setItemsToState ] = useState(initialState)

  const setProducts = newProds => {
    setItemsToState(prevProds => [...prevProds, ...newProds])
  }

  return [products, setProducts]
}

const Home = ({ prods }) => {
  const [ products, setProducts ] = useProductsState(prods)

  useEffect(() => {
    if (prods !== undefined) {
      return
    }

    const apiResponse = getMockProducts()

    setProducts(apiResponse)
  }, [])

  const docHeadProps = {
    title       : 'Reebelo Products List',
    description : 'A products list page demo app for Reebelo.',
    img         : '/250/000000/FFFFFF/?text=Reebelo Demo'
  }

  return (
    <main className='col-12 grid'>
      <DocumentHead {...docHeadProps} />
      <h1 className='col-12 t-center margin-tb-s'>Home Page</h1>
      {renderProducts({ products })}

      <div className='col-12 grid-center'>
        <button
          onClick={() => setProducts(getMockProducts())}
          className={`btn ${styles.button} margin-tb-l padded-l`}
        >Load More</button>
      </div>
    </main>
  )
}

export const getServerSideProps = ({ params }) => {
  return {
    props : {
      prods : getMockProducts()
    }
  }
}

export default Home


