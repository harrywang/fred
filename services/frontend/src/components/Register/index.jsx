import React, { useState } from 'react'
import styles from './index.module.scss'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'

const RegisterForm = props => {
  const { handleRegisterFormSubmit } = props

  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async values => {
    console.log(values)
    setSubmitting(true)
    let result = await handleRegisterFormSubmit(values)

    if (result && result.status && result.status == 201) {
      message.success('You have registered successfully.')
      // TODO: app should login automatically and redirect after register
    } else if (
      result &&
      result.response &&
      result.response.data &&
      result.response.data.message
    ) {
      message.error(result.reponse.data.message)
    } else {
      message.error('Unknown Error in Register Component.')
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
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input your username' }]}
        >
          <Input />
        </Form.Item>
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
            type="primary"
            htmlType="submit"
            style={{ width: '100%' }}
            disabled={submitting}
            value="Register"
            data-testid="register-button"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

const Register = props => {
  const { handleRegisterFormSubmit } = props

  return (
    <div className={styles.register_wrap}>
      <div className={styles.register_title}>Try it out, my friend!</div>
      <div className={styles.register_content}>
        <RegisterForm handleRegisterFormSubmit={handleRegisterFormSubmit} />
      </div>
    </div>
  )
}

export default Register
