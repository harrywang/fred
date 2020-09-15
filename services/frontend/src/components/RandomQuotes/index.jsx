import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Row } from 'antd'
import axios from 'axios'
import styles from './index.module.scss'
import { useEffect } from 'react'

const RandomQuotes = () => {
  const [randomQuotes, setRandomQuotes] = useState([])

  const getRandomQuotes = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/quotes/random`)
      .then(res => {
        setRandomQuotes(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getRandomQuotes()
  }, [])

  // TODO: the position of author's name will sometimes out of the box
  return (
    <div className={styles.quotes_wrap}>
      <div className={styles.quotes_mask}></div>
      <div className={styles.quotes_content}>
        <div className={styles.quotes_title}>Quotes of the Day</div>
        <div className={styles.quotes_subtitle}>
          <a href="http://source.unsplash.com">
            Random Background Image from Unsplash
          </a>
        </div>
        <div className={styles.quotes_cards}>
          <Row gutter={24} justify="center">
            {randomQuotes.map(item => (
              <Col span={6} key={item.id}>
                <Card>
                  <div className={styles.item_content}>{item.content}</div>
                  <div className={styles.item_author}>{item.author_name}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}

export default RandomQuotes
