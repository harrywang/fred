import React, { useState } from 'react'
import styles from './index.module.scss'
import { Redirect } from 'react-router-dom'
import { useEffect } from 'react'

const Status = props => {
  const { isAuthenticated, getUserStatus } = props
  const [state, setState] = useState({ email: '', username: '' })

  useEffect(() => {
    const initStatus = async () => {
      let data = await getUserStatus()
      if (data && data.email && data.username) {
        setState({
          email: data.email,
          username: data.username,
        })
      } else {
        console.log(data)
      }
    }
    initStatus()
  }, [isAuthenticated])

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
