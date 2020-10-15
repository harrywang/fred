import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.module.scss'

const NavBar = props => {
  const { logoutUser, isAuthenticated } = props

  const menu = isAuthenticated('in the nav bar') ? (
    <Menu theme="light" mode="horizontal">
      <Menu.Item key="status">
        <Link to="/status" data-testid="nav-status">
          User Status
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <div
          onClick={() => {
            logoutUser()
          }}
          data-testid="nav-logout"
        >
          Log Out
        </div>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu theme="light" mode="horizontal">
      <Menu.Item key="register">
        <Link to="/register" data-testid="nav-register">
          Register
        </Link>
      </Menu.Item>
      <Menu.Item key="login">
        <Link to="/login" data-testid="nav-login">
          Log In
        </Link>
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.navbar_wrap}>
      <div
        className={styles.navbar_logo}
        onClick={() => {
          window.location.href = '/'
        }}
      >
        Fred
      </div>
      {menu}
    </div>
  )
}

NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired,
}

export default NavBar
