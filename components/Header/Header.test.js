import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import Header from './Header'
import { VisaLogo } from '$COMPONENTS/icons/index';

describe('>> COMPONENT -- Tests Header', () => {
    it('Header Snapshot Test', () => {
        const component = renderer
            .create(<Header />)
            .toJSON()

        expect(component).toMatchSnapshot();
    })

    it('renders visa logo', () => {
        const header = shallow(<Header />);

        expect(header.find("img").prop("src")).toEqual(VisaLogo);

    });

    it('renders hr component', () => {
        const header = shallow(<Header />);

        expect(header.containsMatchingElement(<hr />)).toEqual(true)
    })
})

