import * as React from 'react';
import { shallow } from 'enzyme';

import TodoLabel from '../todoLabel';

test('Todo label has label from prop', () => {
  const label = shallow(<TodoLabel label="Some label" />);

  expect(label.find('span').text()).toBe('@Some label');
});
