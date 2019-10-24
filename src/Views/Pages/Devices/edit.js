import React, { Component } from 'react'
import {Icon, Card, Typography, Row, Col, Button} from 'antd'

import Colors from '../../../Utils/Themes/Colors'
import DevicesForm from './form'
import I18n from '../../../i18n'
import NavigationMap from '../../Components/NavigationMap'
import Services from '../../../Services'
import openNotification from '../../../Utils/OpenNotification'
import MapNavigationTemp from '../../../Utils/MapNavigationTemp'
import {Link, withRouter} from 'react-router-dom'
import ButtonExport from '../../Components/NavigationMap/ButtonExport'
import _ from 'lodash'

class DevicesEdit extends Component {
  state = {
    device: this.props.location.state,
    mapNavigation: {},
    isBlocking: false
  }

  componentDidMount() {
    this.removeTempMap()
  }

  componentWillUnmount() {
    this.removeTempMap()
  }

  removeTempMap = async () => {
    if (MapNavigationTemp.get()) {
      const response = await Services.MapNavigation.deleteScreen(
        MapNavigationTemp.get()
      )
      if (response) {
        MapNavigationTemp.remove()
      }
    }
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  onSubmitDevice = async () => {
    const form = this.formRef.props.form

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      values = {
        ...this.state.device,
        ...values,
        name: values.name.trim().toLowerCase()
      }

      values.mapNavigation = this.state.mapNavigation._id

      const result = await Services.Devices.update(values._id, {
        ...values
      })

      if (result && result.status.success) {
        MapNavigationTemp.remove()
        this.setState({isBlocking: false})
        openNotification('success', I18n.t(result.status.message))
        this.props.history.push('/devices')
      }
    })
  }

  render() {
    return (
      <>
        <Row
          type='flex'
          justify='space-between'
          style={{
            color: Colors.DARK_BLUE,
            marginBottom: 20
          }}
        >
          <Col style={{ fontSize: 21 }}>
            <Icon type='desktop' style={{ marginRight: 8 }} />
            {I18n.t('device.title')}
          </Col>
        </Row>

        <Card style={{ padding: '15px 15px', marginBottom: 10 }}>
          <Typography.Text
            level={4}
            style={{
              color: Colors.DARK_BLUE,
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {I18n.t('device.card.register.title')}
          </Typography.Text>
          <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

          <DevicesForm
            data={this.state.device}
            onSubmit={data => this.onSubmitDevice(data)}
            labelButton={I18n.t('button.update')}
            wrappedComponentRef={this.saveFormRef}
          />

          <NavigationMap
            blocking={this.state.isBlocking}
            handleBlocking={option => this.setState({ isBlocking: option })}
            data={this.state.device}
            handleMapNavigation={data => this.setState({ mapNavigation: data })}
          />

          <div style={{ marginTop: 10 }}>
            <Button
              type='primary'
              htmlType='submit'
              icon='save'
              style={{ float: 'right' }}
              onClick={() => this.onSubmitDevice()}
            >
              {I18n.t('button.update')}
            </Button>

            {!_.isEmpty(this.state.mapNavigation) && (
              <ButtonExport
                tree={this.state.mapNavigation}
              />
            )}

            <Link to='/devices'>
              <Button
                type='ghost'
                style={{ float: 'right', marginRight: 20, background: '#FFF' }}
              >
                {I18n.t('button.cancel')}
              </Button>
            </Link>
          </div>
        </Card>
      </>
    )
  }
}

export default withRouter(DevicesEdit)
