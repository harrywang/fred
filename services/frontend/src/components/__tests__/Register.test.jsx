import React from 'react'
import { cleanup, fireEvent, wait } from '@testing-library/react'

import Register from '../Register'

afterEach(cleanup)

// TODO: remove validation test temporarily

describe('renders', () => {
  const props = {
    handleRegisterFormSubmit: () => {
      return true
    },
    isAuthenticated: () => {
      return false
    },
  }

  test('default props', () => {
    const { getByLabelText, getByTestId } = renderWithRouter(
      <Register {...props} />,
    )

    const usernameInput = getByLabelText('Username')
    expect(usernameInput).toHaveAttribute('type', 'text')
    expect(usernameInput).not.toHaveValue()

    const emailInput = getByLabelText('E-mail')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).not.toHaveValue()

    const passwordInput = getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).not.toHaveValue()

    const button = getByTestId('register-button')
    expect(button).toHaveValue('Register')
  })

  test('a snapshot properly', () => {
    const { asFragment } = renderWithRouter(<Register {...props} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
