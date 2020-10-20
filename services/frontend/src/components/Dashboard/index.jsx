import React from 'react'
import styles from './index.module.scss'
import { Row, Col, Card } from 'antd'
import { Bar, Pie, TinyArea, TinyColumn, TinyLine } from '@ant-design/charts'

const ChartCard = props => {
  return (
    <Card title={props.title} bordered={false} style={{ height: '100%' }}>
      {props.content}
    </Card>
  )
}

const DemoBar = () => {
  const data = [
    {
      type: '1',
      sales: 38,
    },
    {
      type: '2',
      sales: 52,
    },
    {
      type: '3',
      sales: 61,
    },
    {
      type: '4',
      sales: 145,
    },
    {
      type: '5',
      sales: 48,
    },
    {
      type: '6',
      sales: 38,
    },
    {
      type: '7',
      sales: 38,
    },
    {
      type: '8',
      sales: 38,
    },
  ]

  const config = {
    data,
    height: 180,
    xField: 'sales',
    yField: 'type',
  }

  return <Bar {...config} />
}

const DemoPie = () => {
  const data = [
    {
      type: '1',
      value: 27,
    },
    {
      type: '2',
      value: 25,
    },
    {
      type: '3',
      value: 18,
    },
    {
      type: '4',
      value: 15,
    },
    {
      type: '5',
      value: 10,
    },
    {
      type: '6',
      value: 5,
    },
  ]
  const config = {
    appendPadding: 10,
    data,
    height: 180,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'inner',
      content: '{name}',
      offset: -16,
      style: {
        fill: '#333',
        fontSize: 14,
        textAlign: 'center',
      },
    },
  }
  return <Pie {...config} />
}

const DemoTinyColumn = () => {
  const config = {
    height: 120,
    data: new Array(100).fill(0).map(() => Math.random() * 100),
  }
  return <TinyColumn {...config} />
}

const DemoTinyArea = () => {
  const config = {
    height: 120,
    data: new Array(100).fill(0).map(() => Math.random() * 100),
    smooth: true,
  }
  return <TinyArea {...config} />
}

const DemoTinyLine = () => {
  const config = {
    height: 120,
    data: new Array(100).fill(0).map(() => Math.random() * 100),
    smooth: true,
    backgroundColor: 'white',
  }
  return <TinyLine {...config} />
}

const Dashboard = props => {
  return (
    <div className={styles.dashborad_wrap}>
      <div className={styles.dashboard_title}>Dashboard</div>
      <div className={styles.dashboard_content}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <ChartCard title="Demo Column" content={<DemoTinyColumn />} />
          </Col>
          <Col span={8}>
            <ChartCard title="Demo Area" content={<DemoTinyArea />} />
          </Col>
          <Col span={8}>
            <ChartCard title="Demo Line" content={<DemoTinyLine />} />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <ChartCard title="Demo Bar" content={<DemoBar />} />
          </Col>
          <Col span={12}>
            <ChartCard title="Demo Pie" content={<DemoPie />} />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Dashboard
