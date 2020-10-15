import React, { useState } from 'react'
import styles from './index.module.scss'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import { useEffect } from 'react'

const LoginForm = props => {
  const { handleLoginFormSubmit } = props

  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async values => {
    setSubmitting(true)
    let result = await handleLoginFormSubmit(values)

    if (result && result.status && result.status == 200) {
      message.success('You have logged in successfully.')
    } else if (
      result &&
      result.response &&
      result.response.data &&
      result.response.data.message
    ) {
      message.error(result.response.data.message)
    } else {
      message.error('Unknown Error in Login Component.')
    }

    setSubmitting(false)
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
          <Input type="email" />
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
            id="login-button"
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            disabled={submitting}
            value="Log in"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const Login = props => {
  const { handleLoginFormSubmit } = props

  useEffect(() => {
    const { isAuthenticated } = props
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
