import React, { Suspense, lazy } from 'react'
import {
  Route,
  Switch
} from 'react-router-dom'

import { Header, Loader } from '$COMPONENTS'

const Home = lazy(() => import('$SCREENS/Home/Home'))
const Product = lazy(() => import('$SCREENS/Product/Product'))

const routes = () => {
  return (
    <div className='app grid'>
      <div className='col'>
        <Header />
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/products/:id' component={Product} />
          </Switch>
        </Suspense>
      </div>
    </div>
  )
}

export default routes

