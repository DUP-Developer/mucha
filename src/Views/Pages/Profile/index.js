import React, { Component } from 'react'
import { Row, Col, Icon, Card, Typography } from 'antd'
import ProfileForm from './form'
import Colors from '../../../Utils/Themes/Colors'
import i18n from '../../../i18n';
import Auth from '../../../Utils/Auth';
import openNotification from '../../../Utils/OpenNotification';

export default class Profile extends Component {
  state = {
    changePassword: false
  }

    componentDidMount() {
      if (Auth.isFirstAccess()) {
        openNotification('warning', i18n.t('user.warning.changePassword'))
      }
    }

  showPassForm = () => {
    this.setState({ changePassword: true })
  }

  render() {
    const headerStyle = {
      color: Colors.DARK_BLUE,
      marginBottom: 20
    }
    return (
      <>
        <Row type="flex" justify="space-between" style={headerStyle}>
          <Col style={{ fontSize: 21 }}>
            <Icon type="profile" style={{ marginRight: 8 }} />
              {i18n.t('user.dropdownHeaderTop.profile')}
          </Col>
        </Row>

        <Card style={{ paddingTop: 10 }}>
          <Row>
            <Typography.Title
              level={4}
              style={{ color: Colors.DARK_BLUE, fontWeight: 'bold' }}
            >
              {i18n.t('user.labels.dataPerson')}
            </Typography.Title>
            <hr
              style={{
                border: `0.5px solid ${Colors.MID_BLUE}`,
                marginBottom: 20
              }}
            />

            <ProfileForm />
          </Row>
        </Card>
      </>
    )
  }
}
