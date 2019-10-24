import React, { Component } from 'react'
import {Icon, Table, Card, Button, Row, Modal, Typography, Tooltip} from 'antd'

import Colors from '../../../Utils/Themes/Colors'
import Services from '../../../Services'
import { Link } from 'react-router-dom'
import I18n from '../../../i18n'
import openNotification from '../../../Utils/OpenNotification'
import '../Devices/device.css'
import CustomEmpty from '../../Components/CustomEmpty'

export default class Devices extends Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('device.table.columns.name'),
        dataIndex: 'name',
        key: I18n.t('user.table.columns.name'),
        width: '60%',
        className: 'text-table',
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {dataRow.name}
            </p>
          </>
        )
      },
      {
        title: I18n.t('user.table.columns.action'),
        key: I18n.t('user.table.columns.action'),
        width: '30%',
        render: (text, dataRow) => (
          <>
            <Tooltip title={I18n.t('button.tooltip.edit')}>
              <Link
                className="hover-edit"
                style={{
                  border: '1px solid #F3AE62',
                  padding: '6px 8px 6px 8px',
                  textAlign: 'center',
                  borderRadius: '4px',
                  marginRight: 10
                }}
                to={{
                  pathname: `devices/edit/${dataRow._id}`,
                  state: { ...dataRow }
                }}
              >
                <Icon
                  className="hover-edit-icon"
                  type="edit"
                  style={{
                    color: Colors.YELLOW_ICON_EDIT,
                    // marginRight: 10,
                    borderColor: Colors.YELLOW_ICON_EDIT
                  }}
                />
              </Link>
            </Tooltip>
            <Tooltip title={
              dataRow.active
                ? I18n.t('button.tooltip.disable')
                : I18n.t('button.tooltip.enable')
            }>
              <Button
                icon={dataRow.active ? 'stop' : 'check'}
                type={dataRow.active ? 'danger' : 'success'}
                onClick={() => this.showDeleteConfirm(dataRow)}
                style={{
                  borderColor: dataRow.active
                    ? Colors.REMOVE_BUTTON
                    : Colors.ENABLE_ITEM,
                  color: dataRow.active
                    ? ''
                    : Colors.ENABLE_ITEM
                }}
              />
            </Tooltip>
          </>
        )
      }
    ],
    devices: [],
    loading: true
  }

  async componentDidMount() {
    this.getDevices()

    this.setState({ loading: false })
  }

  getDevices = async () => {
    const devices = (await Services.Devices.listAll()).data
      .slice(0, 5)
      .map(device => ({
        ...device,
        key: device._id
      }))
      .sort(device => (device.active) ? -1 : 1)

    this.setState({
      devices
    })
  }

  handleDeviceActived = (key, bool) => {
    const devices = this.state.devices
    .map(device => {
      if (device._id === key) {
        device.active = bool
      }

      return device
    })
    .sort(device => (device.active) ? -1 : 1)

    this.setState({devices})
  }

  showDeleteConfirm(dataRow) {
    Modal.confirm({
      title: dataRow.active
        ? I18n.t('device.modal.confirm.inactive')
        : I18n.t('device.modal.confirm.active'),
      content: dataRow.name,
      okText: I18n.t('button.yes'),
      okType: 'danger',
      cancelText: I18n.t('button.no'),
      maskClosable: true,
      onOk: async () => {
        // caso esteja desativado e queira ativar ele faz o change
        const result = dataRow.active
          ? await Services.Devices.remove(dataRow.key)
          : await Services.Devices.update(dataRow.key, { active: true })

        if (result.data.ok) {
          this.handleDeviceActived(dataRow.key, !dataRow.active) // na logica é o que quero é inverter o status original
          openNotification('success',  I18n.t(result.status.message))
        }
      }
    })
  }

  render() {
    const { devices, loading, columnsConfig } = this.state

    return (
      <>
        <Card style={{ padding: '15px 10px' }}>
          <Row type="flex" justify="space-between" align="middle">
            <Typography.Title
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 0
              }}
            >
              {I18n.t('dashboard.card.device.title')}
            </Typography.Title>

            <Button ghost type="primary" style={{ marginRight: 10 }}>
              <Link to="devices/register">
                <Icon type="plus-circle" /> {I18n.t('button.register')}
              </Link>
            </Button>{' '}
          </Row>
          <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

          <Table
            columns={columnsConfig}
            dataSource={devices}
            pagination={false}
            loading={loading}
            locale={{emptyText: (<CustomEmpty />)}}
          />
        </Card>
      </>
    )
  }
}
