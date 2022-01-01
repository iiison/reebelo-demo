import React from 'react'
import { shallow, mount } from 'enzyme'
import renderer from 'react-test-renderer'

import PinComponent, {
  handleInputChange,
  handleSubmit,
  handleKeyUp
} from './PinComponent'

const defaultProps = {
  heading    : 'Heading',
  subHeading : 'Subheading',
  onSubmit   : jest.fn(),
  error      : ''
}

describe('>> COMPONENT -- Tests PinComponent ', () => {
  describe('• handleInputChange function tests', () => {
    it('triggers the handleInputChange function', () => {
      const index = 0
      const setPinMock = jest.fn()
      const eventMock = {
        persist       : jest.fn(),
        currentTarget : {
          value : 'abc'
        }
      }

      handleInputChange(setPinMock)(index)(eventMock)

      expect(eventMock.persist).toHaveBeenCalled()
      expect(setPinMock).toHaveBeenCalledWith({
        [index] : eventMock.currentTarget.value
      })
    })
  })

  describe('• handleKeyUp function tests', () => {
    let setFocusMock, eventMock

    beforeEach(() => {
      setFocusMock = jest.fn()
      eventMock = {
        persist       : jest.fn(),
        currentTarget : {
          value : 1
        }
      }
    })

    it('should call setFocus function with 1', () => {
      handleKeyUp(setFocusMock)(0)({
        ...eventMock,
        keyCode : 48
      })

      expect(setFocusMock).toHaveBeenCalledWith(1)
    })

    it('should not call setFocus function due to the last input', () => {
      handleKeyUp(setFocusMock)(3)({
        ...eventMock,
        keyCode : 48
      })

      expect(setFocusMock).not.toHaveBeenCalled()
    })

    it('should not call setFocus function due to wrong keyCode', () => {
      handleKeyUp(setFocusMock)(0)({
        ...eventMock,
        keyCode : 200
      })

      expect(setFocusMock).not.toHaveBeenCalled()
    })

    it('tests backspace key press to set focus on previous input', () => {
      handleKeyUp(setFocusMock)(1)({
        ...eventMock,

        keyCode : 8
      })

      expect(setFocusMock).toHaveBeenCalledWith(0)
    })

    it('tests backspace key press to keep focus on same input', () => {
      handleKeyUp(setFocusMock)(0)({
        ...eventMock,

        keyCode : 8
      })

      expect(setFocusMock).not.toHaveBeenCalled()
    })
  })

  describe('• handleSubmit function tests', () => {
    it('tests handleSubmit happy flow', () => {
      const submitPropMock = jest.fn()
      const pinState = [1, 3, 2, 4]
      const setValidationErrorMock = jest.fn()

      handleSubmit({
        pinState,
        onSubmitProp       : submitPropMock,
        setValidationError : setValidationErrorMock
      })()

      expect(setValidationErrorMock).toHaveBeenCalledWith('')
      expect(submitPropMock).toHaveBeenCalledWith(pinState.join(''))
    })

    it('tests handleSubmit with empty pin', () => {
      const submitPropMock = jest.fn()
      const pinState = []
      const setValidationErrorMock = jest.fn()

      handleSubmit({
        pinState,
        onSubmitProp       : submitPropMock,
        setValidationError : setValidationErrorMock
      })()

      expect(setValidationErrorMock).toHaveBeenCalledWith('Pin is invalid.')
      expect(submitPropMock).toBeCalledTimes(0)
    })

    it('tests handleSubmit with undefined pin', () => {
      const submitPropMock = jest.fn()
      const pinState = undefined
      const setValidationErrorMock = jest.fn()

      handleSubmit({
        pinState,
        onSubmitProp       : submitPropMock,
        setValidationError : setValidationErrorMock
      })()

      expect(setValidationErrorMock).toHaveBeenCalledWith('Pin is invalid.')
      expect(submitPropMock).toBeCalledTimes(0)
    })

    it('tests handleSubmit with partial pin', () => {
      const submitPropMock = jest.fn()
      const pinState = [1, 3]
      const setValidationErrorMock = jest.fn()

      handleSubmit({
        pinState,
        onSubmitProp       : submitPropMock,
        setValidationError : setValidationErrorMock
      })()

      expect(setValidationErrorMock).toHaveBeenCalledWith('Pin is invalid.')
      expect(submitPropMock).toBeCalledTimes(0)
    })
  })

  describe('• PinComponent DOM Tests', () => {
    it('PinComponent Snapshot Test', () => {
      const props = defaultProps
      const component = renderer
        .create(<PinComponent {...props} />)
        .toJSON()

      expect(component).toMatchSnapshot();
    })

    it('Checks if input count is 4', () => {
      const props = defaultProps
      const component = shallow(<PinComponent {...props} />)

      const inputCount = component.find('PinInputUnit').length
      const expectedCount = 4

      expect(inputCount).toBe(expectedCount)
    })

    it('Triggers the Form submission with invalid values', () => {
      const props = defaultProps
      const component = mount(<PinComponent {...props} />)

      component.find('button').simulate('click')

      expect(props.onSubmit).toBeCalledTimes(0)
    })
  })
})

