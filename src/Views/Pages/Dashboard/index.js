import React, { Component } from 'react'
import {Col, Icon, Row} from 'antd'
import I18n from '../../../i18n'
import Colors from '../../../Utils/Themes/Colors'
import Reports from './Reports'
import Devices from './Devices'
import Users from './Users'
import './dashboard.css'
import * as constants from '../../../Utils/Constants';
import Auth from '../../../Utils/Auth';

const headerStyle = {
  color: Colors.DARK_BLUE,
  marginBottom: 20
}

export default class Dashboard extends Component {
  state = {
    reports: [],
    loading: true
  }

  componentDidMount() {
    this.setState({ loading: false })
  }

  _renderAdminInfo() {    
    if (constants.USER_TYPES.ADMIN === Auth.getUser().userType) {
     return ( 
      <>
        <div style={{ width: '49%' }}>
          <Devices />
        </div>

        <div style={{ width: '49%' }}>
          <Users />
        </div>        
      </>)
    }
  }

  render() {
    return (
      <div className='dashboard'>
        <Row type='flex' justify='space-between' style={headerStyle}>
          <Col style={{ fontSize: 24 }}>
            <Icon type='home' style={{ marginRight: 8 }} />
            {I18n.t('dashboard.title')}
          </Col>
        </Row>

        <Row type='flex' justify='space-between' style={headerStyle}>
          <Col span={24} style={{ marginBottom: 50 }}>
            <Reports />
          </Col>

          {
            this._renderAdminInfo()
          }
        </Row>        
      </div>
    )
  }
}
