import React, { useState } from 'react'
import axios from 'axios'
import styles from './index.module.scss'
import { Redirect } from 'react-router-dom'
import { useEffect } from 'react'

const Status = props => {
  const { isAuthenticated, accessToken } = props

  const [state, setState] = useState({ email: '', username: '' })

  const getUserStatus = () => {
    const options = {
      url: `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/status`,
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
    return axios(options)
      .then(res => {
        setState({
          email: res.data.email,
          username: res.data.username,
        })
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    getUserStatus()
  }, [])

  if (!isAuthenticated()) {
    return <Redirect to="/login" />
  }

  return isAuthenticated() ? (
    <div className={styles.status_wrap}>
      <div className={styles.status_title}>User Status</div>
      <div className={styles.status_content}>
        <strong>Email: </strong>
        <span data-testid="user-email">{state.email}</span>
        <br />
        <strong>Username: </strong>
        <span data-testid="user-username">{state.username}</span>
      </div>
    </div>
  ) : (
    <Redirect to="/login" />
  )
}

export default Status
