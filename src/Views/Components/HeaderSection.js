import React from 'react'
import { Col, Icon } from 'antd'

function HeaderSection(props) {
  return (
    <Col style={{fontSize: '21px'}}>
      <Icon type={props.icon} />{' '}
      {props.title}
    </Col>
  )
}

export default HeaderSection