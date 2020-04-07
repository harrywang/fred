import React from 'react';
import { render, cleanup } from '@testing-library/react';

import LoginForm from '../LoginForm';

afterEach(cleanup);

const props = {
  handleLoginFormSubmit: () => { return true },
  isAuthenticated: () => { return false },
}

test('renders properly', () => {
  const { getByText } = renderWithRouter(<LoginForm {...props} />);
  expect(getByText('Welcome, I am Fred :)')).toHaveClass('title');
});

test('renders with default props', () => {
  const { getByLabelText, getByText } = renderWithRouter(<LoginForm {...props} />);

  const emailInput = getByLabelText('Email');
  expect(emailInput).toHaveAttribute('type', 'email');
  expect(emailInput).not.toHaveValue();

  const passwordInput = getByLabelText('Password');
  expect(passwordInput).toHaveAttribute('type', 'password');
  expect(passwordInput).not.toHaveValue();

  const buttonInput = getByText('Log in');
  expect(buttonInput).toHaveValue('Log in');
});

test("renders", () => {
  const { asFragment } = renderWithRouter(<LoginForm {...props} />);
  expect(asFragment()).toMatchSnapshot();
});
