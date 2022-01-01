import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import * as reactRedux from 'react-redux'
// import { useHistory } from 'react-router-dom';
import * as reactRouterDOM from 'react-router-dom';

import Step2, * as events from './Step2'
import * as pinActions from '$RMODULES/pin/pin'

describe('>> SCREEN -- Tests Pin Enrollment Step2', () => {
  describe('• handleSubmit function tests', () => {
    const { handleSubmit } = events

    it('Checks if dispatch was passed to the function', () => {
      const partialHandler = handleSubmit({})

      try {
        partialHandler(1234)
      } catch (error) {
        expect(error.message).toBe('Please pass dispatch.')
      }
    })

    it('Checks if history was passed to the function', () => {
      const dispatch = jest.fn()
      const partialHandler = handleSubmit({ dispatch })

      try {
        partialHandler(1234)
      } catch (error) {
        expect(error.message).toBe('Please pass history from react-router.')
      }
    })

    it('Expects four digits in param: pin', () => {
      const dispatch = jest.fn()
      const history = {}
      const previousPin = '1234'

      const partialHandler = handleSubmit({ history, dispatch, previousPin })

      try{
        partialHandler()
      } catch(error) {
        expect(error.message).toBe('Please pass pin.')
      }
    })

    it('Calls triggerSetPin when called with right pin', () => {
      const previousPin = '1234'
      const dispatch = jest.fn()
      const history = {
        push : jest.fn()
      }

      pinActions.triggerSetPin = jest.fn()

      const partialHandler = handleSubmit({ history, dispatch, previousPin })

      partialHandler('1234')

      expect(dispatch).toHaveBeenCalled()
      expect(pinActions.triggerSetPin).toHaveBeenCalledWith('1234')
      // expect(history.push).toHaveBeenCalledWith('/enrollment/setPin')
    })

    it('Calls setPinFailure when called with wrong pin', () => {
      const previousPin = '1234'
      const dispatch = jest.fn()
      const history = {
        push : jest.fn()
      }

      pinActions.setPinFailure = jest.fn()

      const partialHandler = handleSubmit({ history, dispatch, previousPin })

      partialHandler('5678')

      expect(dispatch).toHaveBeenCalled()
      expect(pinActions.setPinFailure).toHaveBeenCalledWith('Pin do not match.')
      // expect(history.push).toHaveBeenCalledWith('/enrollment/setPin')
    })
  })

  describe('• Pin Enrollment Step2 DOM Tests', () => {
    beforeEach(() => {
      reactRedux.useDispatch = jest.fn()

      // jest.mock('react-redux', () => ({
      //   useDispatch : () => ({
      //     dispatch : jest.fn
      //   }),
      // }))
      // jest.spyOn(rea)
    })

    it('Step2 Snapshot Test', () => {
      // reactRouterDOM.useHistory = { goBack : jest.fn() }
      // const goBack = jest.fn()

      // reactRedux.useSelector = jest.fn((state = {}) => ({ response : null }))
      // jest.spyOn(reactRouterDOM, 'useHistory', 'get').mockImplementation(() => {
      //   goback : jest.fn()
      // })

      // const component = renderer
      //   .create(<Step2 />)
      //   .toJSON()

      // expect(component).toMatchSnapshot();
    })

    it('Checks Step2 when previous pin is undefined', () => {
      // const goBack = jest.fn()


      // reactRouterDOM.useHistory = jest.fn(() => ({
      //   useHistory : () => ({
      //     goBack
      //   })
      // }))

      // reactRouterDOM.useHistory = { goBack }
      // reactRedux.useSelector = jest.fn((state = {}) => ({ response : null }))

      // mount(<Step2 />)

      // expect(goBack).toHaveBeenCalled()
    })
  })
})

