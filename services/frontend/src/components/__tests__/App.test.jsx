import React from 'react';
import { cleanup } from '@testing-library/react';

import App from '../../App';

afterEach(cleanup);

test("renders", () => {
  const { asFragment } = renderWithRouter(<App />);
  expect(asFragment()).toMatchSnapshot();
});
