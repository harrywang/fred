import React from 'react'
import { Button, Row, Col } from 'antd'
import RandomQuotes from '../../components/RandomQuotes'
import styles from './index.module.scss'
import Icon from '@ant-design/icons'

const whatFredUsesList = [
  {
    name: 'Flask',
    icon_name: 'flask-outline',
    url: 'https://flask.palletsprojects.com/en/1.1.x/',
  },
  {
    name: 'React',
    icon_name: 'logo-react',
    url: 'https://reactjs.org/',
  },
  {
    name: 'Docker',
    icon_name: 'cube-outline',
    url: 'https://www.docker.com/',
  },
  {
    name: 'Postgres',
    icon_name: 'server-outline',
    url: 'https://www.postgresql.org/',
  },
  {
    name: 'SQLAlchemy',
    icon_name: 'layers-outline',
    url: 'https://www.sqlalchemy.org/',
  },
  {
    name: 'Bulma',
    icon_name: 'logo-css3',
    url: 'https://bulma.io/',
  },
  {
    name: 'CircleCI',
    icon_name: 'git-compare-outline',
    url: 'https://circleci.com/',
  },
  {
    name: 'Heroku',
    icon_name: 'rocket-outline',
    url: 'https://www.heroku.com/',
  },
  {
    name: 'Nodejs',
    icon_name: 'logo-nodejs',
    url: 'https://nodejs.org/',
  },
  {
    name: 'NPM',
    icon_name: 'logo-npm',
    url: 'https://www.npmjs.com/',
  },
  {
    name: 'Jest',
    icon_name: 'flashlight-outline',
    url: 'https://jestjs.io/',
  },
  {
    name: 'Formik',
    icon_name: 'reader-outline',
    url: 'https://jaredpalmer.com/formik/',
  },
  {
    name: 'Python',
    icon_name: 'logo-python',
    url: 'https://www.python.org/',
  },
  {
    name: 'PyTest',
    icon_name: 'hammer-outline',
    url: 'https://docs.pytest.org/',
  },
  {
    name: 'JWT',
    icon_name: 'key-outline',
    url: 'https://jwt.io/',
  },
  {
    name: 'Github',
    icon_name: 'logo-github',
    url: 'https://github.com',
  },
]

const group = (array, subGroupLength) => {
  let index = 0
  let newArray = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }

  return newArray
}

const Welcome = () => (
  <div className={styles.home_welcome_wrap}>
    <div className={styles.home_welcome}>
      <Row justify="center">
        <Col span={12}>
          <div className={styles.home_welcome_text}>
            <div className={styles.home_welcome_text_title}>
              Meet FRED: Flask + REact + Docker
            </div>
            <div className={styles.home_welcome_text_desc}>
              An End-to-End Boilerplate for Full Stack Development
            </div>
            <div className={styles.home_welcome_text_button_wrap}>
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{ marginRight: '8px' }}
              >
                What Fred uses?
              </Button>
              <Button size="large" shape="round">
                Where is Fred?
              </Button>
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.home_welcome_img}>
            <a href="https://undraw.co/">
              <img
                src={process.env.PUBLIC_URL + '/img/illustrations/designer.svg'}
                alt="fred at work"
              />
            </a>
          </div>
        </Col>
      </Row>
    </div>
  </div>
)

const WhatFredUses = () => (
  <div className={styles.use_wrap}>
    <div className={styles.use_title_wrap}>
      <div className={styles.use_title}>What Fred Uses</div>
      <div className={styles.use_subtitle}>to make you happy</div>
      <div className={styles.use_divider} />
    </div>
    <div className={styles.icon_wrap}>
      {group(whatFredUsesList, 4).map((itemGroup, index) => (
        <Row justify="space-around" gutter={[16, 16]} key={index}>
          {itemGroup.map(item => (
            <Col span={3} key={item.name}>
              <div
                className={styles.icon_item_wrap}
                onClick={() => {
                  window.open(item.url)
                }}
              >
                <div className={styles.icon_item}>
                  <Icon
                    component={() => (
                      <ion-icon name={item.icon_name} size="large" />
                    )}
                  />
                </div>
                <div className={styles.icon_title}>{item.name}</div>
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </div>
  </div>
)

const Home = () => {
  return (
    <div>
      <Welcome />
      <WhatFredUses />
      <RandomQuotes />
    </div>
  )
}

export default Home
