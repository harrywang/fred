import React, { useState } from 'react'
import styles from './index.module.scss'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { useEffect } from 'react'

const LoginForm = props => {
  const { handleLoginFormSubmit } = props

  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = values => {
    console.log(values)
    setSubmitting(true)
    handleLoginFormSubmit(values)
    setSubmitting(false)
    window.location.href = '/'
  }

  return (
    <div className={styles.form_wrap}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: 'Please input your E-mail' },
            { type: 'email', message: 'The input is not valid E-mail' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            disabled={submitting}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const Login = props => {
  const { isAuthenticated, handleLoginFormSubmit } = props

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className={styles.login_wrap}>
      <div className={styles.login_title}>Welcome, I am Fred :)</div>
      <div className={styles.login_content}>
        <LoginForm handleLoginFormSubmit={handleLoginFormSubmit} />
      </div>
    </div>
  )
}

export default Login
