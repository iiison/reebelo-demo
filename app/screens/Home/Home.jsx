import React, { useEffect, useState } from 'react'

import dummyProds from './mockProds.json'
import styles from './styles.css'

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
              onClick={() => history.push(`/table/${id}`)}
              role='link'
              key={name}
            >
              <a href={`products/${id}`} className='normal-color grid'>
                <article
                  itemScope
                  itemType='http://schema.org/Product'
                  className={`grid col-12 ${styles.productCont}`} id={id}
                >
                  <div className='col-12 padded-s'>
                    <div className='grid-center'>
                      <div className={`col-12 grid-middle grid-center ${styles.prodImg}`}>
                        <img
                          alt={name}
                          src={`https://via.placeholder.com/250/000000/FFFFFF/?text=${name}`}
                        />
                      </div>
                      <h2 itemProp='name' className={`col-12 ${styles.prodName}`}>{name}</h2>
                      <p itemProp='description' className={`${styles.smalls} col-12`}>{desc}</p>
                      <p className={`dollar col-12 margin-top-s`}><data value={price}>{price}</data></p>
                    </div>
                  </div>
                </article>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const useProductsState = () => {
  const [ products, setItemsToState ] = useState([])

  const setProducts = newProds => {
    setItemsToState(prevProds => [...prevProds, ...newProds])
  }

  return [products, setProducts]
}

const Home = () => {
  const [ products, setProducts ] = useProductsState()

  useEffect(() => {
    const apiResponse = getMockProducts()

    setProducts(apiResponse)
  }, [])

  return (
    <main className='col-12 grid'>
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

export default Home

