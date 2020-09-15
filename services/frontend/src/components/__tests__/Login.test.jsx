import React from 'react'
import { render, cleanup } from '@testing-library/react'

import Login from '../Login'

afterEach(cleanup)

const props = {
  handleLoginFormSubmit: () => {
    return true
  },
  isAuthenticated: () => {
    return false
  },
}

test('renders properly', () => {
  const { getByText } = renderWithRouter(<Login {...props} />)
  expect(getByText('Welcome, I am Fred :)')).toHaveClass('login_title')
})

test('renders with default props', () => {
  const { getByLabelText } = renderWithRouter(<Login {...props} />)

  const emailInput = getByLabelText('E-mail')
  expect(emailInput).toHaveAttribute('type', 'email')
  expect(emailInput).not.toHaveValue()

  const passwordInput = getByLabelText('Password')
  expect(passwordInput).toHaveAttribute('type', 'password')
  expect(passwordInput).not.toHaveValue()

  // const buttonInput = getByText('Log in')
  const button = document.getElementById('login-button')
  // console.log(buttonInput)
  expect(button).toHaveAttribute('type', 'submit')
  expect(button).toHaveValue('Log in')
})

test('renders', () => {
  const { asFragment } = renderWithRouter(<Login {...props} />)
  expect(asFragment()).toMatchSnapshot()
})
