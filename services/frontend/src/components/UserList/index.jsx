import React, { useState } from 'react'
import styles from './index.module.scss'
import { useEffect } from 'react'
import { Table } from 'antd'

const UserList = (props) => {
    const { isAuthencated, getUsers } = props
    const [users, setUsers] = useState([])

    useEffect(() => {
        const initUserList = async () => {
            let data = await getUsers()
            setUsers(data)
        }
        initUserList()
    }, [isAuthencated])

    const dataColumns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
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

    return <div className={styles.user_list_wrap}>
        <div className={styles.user_list_title}>
            User List
        </div>
        <div className={styles.user_list_content}>
            <Table columns={dataColumns} dataSource={users} />
        </div>
    </div>
}

export default UserList
