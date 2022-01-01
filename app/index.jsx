import React from 'react'
import { hydrate } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from '$CONFIGS/store'
import routes from '$CONFIGS/routes'

hydrate(
  <Provider store={store}>
    <BrowserRouter>
      {routes()}
    </BrowserRouter>
  </Provider>, document.getElementById('root')
)

