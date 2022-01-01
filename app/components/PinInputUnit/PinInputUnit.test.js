import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import PinInputUnit from './PinInputUnit'


const defaultInputProps = {
  refVal: () => { },
  value: '',
  events: {
    onChange: () => { }
  },
  classes: ''
}

describe('>> COMPONENT -- Tests PinInputUnit', () => {
  it('PinComponent Snapshot Test', () => {
    const props = defaultInputProps
    const component = renderer
      .create(<PinInputUnit {...props} />)
      .toJSON()

    expect(component).toMatchSnapshot();
  })

  it('renders single pin input with default props', () => {
    const props = defaultInputProps
    const input = shallow(<PinInputUnit {...props} />)

    const expectedClass = 'pinInput'

    expect(input.hasClass(expectedClass)).toBe(true)
  })

  // TODO: Is it required ?
  it('renders single pin input with custom class name', () => {
    const props = {
      ...defaultInputProps,
      classes: 'pinInput'
    }
    const input = shallow(<PinInputUnit {...props} />)

    const expectedClass = props.classes
    const expectedType = 'tel'
    const expectedMinVal = 0
    const expectedMaxVal = 9
    const expectedLength = 1

    expect(input.hasClass(expectedClass)).toBe(true)
    expect(input.props().type).toBe(expectedType)
    expect(input.props().min).toBe(expectedMinVal)
    expect(input.props().max).toBe(expectedMaxVal)
    expect(input.props().maxLength).toBe(expectedLength)
  })

  it('renders single pin input with custom value', () => {
    const props = {
      ...defaultInputProps,
      value: 'some value'
    }
    const input = shallow(<PinInputUnit {...props} />)

    const expectedValue = props.value
    const result = input.props().value

    expect(result).toEqual(expectedValue)
  })

  it('triggers single pin input onChange function', () => {
    const onChangeMock = jest.fn()
    const props = {
      ...defaultInputProps,
      events: {
        onChange: onChangeMock
      }
    }
    const input = shallow(<PinInputUnit {...props} />)

    input.simulate('change', { target: { value: 'My new value' } });

    expect(onChangeMock).toBeCalledTimes(1)
  })
})

