import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'
import * as reactRedux from 'react-redux'

import Step1, * as events from './Step1'
import * as pinActions from '$RMODULES/pin/pin'

// Can't mock the file due to a newly introduced bug in Jest:
// https://github.com/facebook/jest/issues/6420
// SO link: https://stackoverflow.com/questions/63878324/how-to-mock-a-module-in-jest
// jest.mock('../../redux/modules/pin/pin', () => {
//   return {
//     triggerSetPin : jest.fn()
//   }
// })

describe('>> SCREEN -- Tests Pin Enrollment Step1', () => {
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

      const partialHandler = handleSubmit({ history, dispatch })

      try{
        partialHandler()
      } catch(error) {
        expect(error.message).toBe('Please pass pin.')
      }
    })

    it('Calls setPinSuccess when called', () => {
      const dispatch = jest.fn()
      const history = {
        push : jest.fn()
      }

      pinActions.setPinSuccess = jest.fn()

      const partialHandler = handleSubmit({ history, dispatch })

      partialHandler('1234')

      expect(dispatch).toHaveBeenCalled()
      expect(pinActions.setPinSuccess).toHaveBeenCalledWith('1234')
      expect(history.push).toHaveBeenCalledWith('/enrollment/setPin')
    })
  })

  describe('• Pin Enrollment Step1 DOM Tests', () => {
    beforeEach(() => {
      reactRedux.useDispatch = jest.fn()
    })

    it('Step1 Snapshot Test', () => {
      const component = renderer
        .create(<Step1 />)
        .toJSON()

      expect(component).toMatchSnapshot();
    })
  })
})

