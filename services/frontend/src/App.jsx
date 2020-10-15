import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Status from './components/Status'
import Dashborad from './components/Dashboard'
import UserStatus from './components/UserStatus'
import { Layout, message } from 'antd'
import styles from './App.module.scss'
import Image404 from './img/404.svg'
import './App.scss'

const App = () => {
  const [users, setUsers] = useState([])
  const [accessToken, setAccessToken] = useState(null)

  const getUsers = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/users`)
      .then(res => {
        setUsers(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const validRefresh = () => {
    const token = window.localStorage.getItem('refreshToken')
    if (token) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/refresh`, {
          refresh_token: token,
        })
        .then(res => {
          setAccessToken(res.data.access_token)
          getUsers()
          window.localStorage.setItem('refreshToken', res.data.refresh_token)
          return true
        })
        .catch(err => {
          console.log(err)
          return false
        })
    }
    return false
  }

  const isAuthenticated = () => {
    if (accessToken || validRefresh()) {
      return true
    }
    return false
  }

  const handleRegisterFormSubmit = async data => {
    const url = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/register`
    return axios
      .post(url, data)
      .then(res => {
        return res
      })
      .catch(err => {
        return err
      })
  }

  const handleLoginFormSubmit = async data => {
    const url = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/login`
    return axios
      .post(url, data)
      .then(res => {
        setAccessToken(res.data.access_token)
        getUsers()
        window.localStorage.setItem('refreshToken', res.data.refresh_token)
        return res
      })
      .catch(err => {
        return err
      })
  }

  const logoutUser = () => {
    window.localStorage.removeItem('refreshToken')
    setAccessToken(null)
    message.success('You have logged out.')
  }

  const PageNotFound = () => (
    <div className={styles.not_found}>
      <div className={styles.not_found_title}>Oops, Page Not Found!</div>

      <div className={styles.not_found_image}>
        <img src={Image404} width="50%" alt="404 Page Not Found" />
      </div>
    </div>
  )

  const { Header, Content, Footer } = Layout

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ background: '#ffffff', display: 'flex' }}>
          <NavBar isAuthenticated={isAuthenticated} logoutUser={logoutUser} />
        </Header>

        <Content>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/login">
              <Login
                isAuthenticated={isAuthenticated}
                handleLoginFormSubmit={handleLoginFormSubmit}
              />
            </Route>
            <Route exact path="/register">
              <Register handleRegisterFormSubmit={handleRegisterFormSubmit} />
            </Route>
            <Route exact path="/status">
              <Status
                isAuthenticated={isAuthenticated}
                accessToken={accessToken}
              />
            </Route>
            <Route exact path="/dashboard">
              <Dashborad isAuthenticated={isAuthenticated} />
            </Route>
            <Route exact path="/status">
              <UserStatus />
            </Route>
            <Route component={PageNotFound} />
          </Switch>
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            background: '#444F60',
            padding: '3rem 1.5rem 6rem',
            color: '#ffffff',
          }}
        >
          Made with <i className="fa fa-heart pulse" /> by{' '}
          <a
            href="http://harrywang.me"
            target="_blank"
            rel="noopener noreferrer"
          >
            Harry Wang
          </a>
        </Footer>
      </Layout>
    </Router>
  )
}

export default App
