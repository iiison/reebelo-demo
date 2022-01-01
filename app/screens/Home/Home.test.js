import React from 'react'
import { render } from '@testing-library/react'
import Home from './Home'

describe('>> SCREEN -- Home', () => {
  // describe('• handleSubmit function tests', () => {
  //   const { handleSubmit } = events

  //   it('Checks if dispatch was passed to the function', () => {
  //     const partialHandler = handleSubmit({})
  //   })
  // })

  describe('• Home Screen DOM Tests', () => {
    // beforeEach(() => {
    //   reactRedux.useDispatch = jest.fn()
    // })

    it('Home Snapshot Tests', () => {
      const component = render(<Home />)

      expect(component).toMatchSnapshot();
    })
  })
})
