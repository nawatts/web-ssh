import { shallow } from 'enzyme';
import React from 'react';

import Terminal from '../src/Terminal';

describe('<Terminal />', () => {
  it('should pass this placeholder test', () => {
    const terminal = shallow(<Terminal />);
    expect(true).to.be.true;
  });
});
