import React, { useState } from 'react'
import styles from './index.module.scss'
import { useEffect } from 'react'
import { Table, Button, Modal, Form, Input, message } from 'antd'

const UserList = props => {
  const { isAuthencated, getUsers, addUser, deleteUser, editUser } = props
  const [users, setUsers] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [addUserModalVisible, setAddUserModalVisible] = useState(false)
  const [editUserModalVisible, setEditUserModalVisible] = useState(false)
  const [addUserHandling, setAddUserHandling] = useState(false)
  const [editUserHandling, setEditUserHandling] = useState(false)
  const [addUserForm] = Form.useForm()
  const [editUserForm] = Form.useForm()

  const updateUserList = async () => {
    let data = await getUsers()

    // add `key` attribute for every item
    // to implement multi-select in Table component
    data = data.map(item => {
      item['key'] = item['id']
      return item
    })
    setUsers(data)
  }

  const onSelectChange = selectedRowKeys => {
    console.log(selectedRowKeys)
    setSelectedRowKeys(selectedRowKeys)
  }

  const handleAddUserButtonClick = () => {
    setAddUserModalVisible(true)
  }

  const handleAddUserFormSubmit = async () => {
    // start handling and set the button to loading status
    setAddUserHandling(true)

    // use `addUser` api in App.jsx to create user
    let result = await addUser(addUserForm.getFieldsValue())

    // we await to get the result, so set handling to false after `await`
    setAddUserHandling(false)

    if (result && result.status && result.status == 201) {
      // success
      message.success('Add user successfully.')
      setAddUserModalVisible(false)
    } else if (
      // error with valid message
      result &&
      result.response &&
      result.response.data &&
      result.response.data.message
    ) {
      message.error(result.response.data.message)
    } else {
      // unknown error
      message.error('Unknown Error in UserList component.')
    }
  }

  const handleDeleteUserButtonClick = async () => {
    selectedRowKeys.map(async key => {
      let result = await deleteUser(key)

      if (result && result.status && result.status == 200) {
        // success
        console.log(result)
        if (result.data && result.data.message) {
          message.success(result.data.message)
        } else {
          message.success(`User id: ${key} was removed!`)
        }
        setAddUserModalVisible(false)
        updateUserList()
      } else if (
        // error with valid message
        result &&
        result.response &&
        result.response.data &&
        result.response.data.message
      ) {
        message.error(result.response.data.message)
      } else {
        // unknown error
        message.error('Unknown Error in UserList component.')
      }
    })
  }

  const handleEditUserButtonClick = () => {}

  const handleEditUserFormSubmit = async () => {}

  const AddUserForm = (
    <Form
      layout="vertical"
      form={addUserForm}
      requiredMark={false}
      onFinish={handleAddUserFormSubmit}
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
    </Form>
  )

  const EditUserForm = (
    <Form
      layout="vertical"
      form={editUserForm}
      requiredMark={false}
      onFinish={handleEditUserFormSubmit}
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
        <Input type="email" disabled={true} />
      </Form.Item>
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: 'Please input your password' }]}
      >
        <Input.Password />
      </Form.Item>
    </Form>
  )

  const dataColumns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'key',
    },
    {
      title: 'User Name',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created Date',
      dataIndex: 'created_date',
      key: 'created_date',
    },
  ]

  useEffect(() => {
    updateUserList()
  }, [isAuthencated, addUserModalVisible])

  return (
    <div className={styles.user_list_wrap}>
      <div className={styles.user_list_title}>User List</div>
      <div className={styles.user_list_content}>
        <div className={styles.user_list_content_button}>
          <Button type="primary" onClick={handleAddUserButtonClick} style={{marginRight: "32px"}}>Add</Button>
          <Button danger onClick={handleDeleteUserButtonClick}>Delete</Button>
        </div>

        <Table
          rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
          columns={dataColumns}
          dataSource={users}
        />
      </div>
      <Modal
        title="Add User"
        visible={addUserModalVisible}
        confirmLoading={addUserHandling}
        onOk={addUserForm.submit}
        onCancel={() => {
          setAddUserModalVisible(false)
        }}
      >
        {AddUserForm}
      </Modal>
      <Modal
        title="Edit User"
        visible={editUserModalVisible}
        confirmLoading={editUserHandling}
        onOk={editUserForm.submit}
        onCancel={() => {
          setEditUserModalVisible(false)
        }}
      >
        {EditUserForm}
      </Modal>
    </div>
  )
}

export default UserList
