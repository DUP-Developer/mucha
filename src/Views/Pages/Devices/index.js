import React, { Component } from 'react'
import {
  Icon,
  Table,
  Card,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Tooltip
} from 'antd'

import Colors from '../../../Utils/Themes/Colors'
import Services from '../../../Services'
import { Link } from 'react-router-dom'
import I18n from '../../../i18n'
import openNotification from '../../../Utils/OpenNotification'
import './device.css'
import CustomEmpty from '../../Components/CustomEmpty'
import _ from 'lodash'

export default class Devices extends Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('device.table.columns.name'),
        dataIndex: 'name',
        key: I18n.t('user.table.columns.name'),
        width: '25%',
        sorter: true,
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
        title: I18n.t('device.table.columns.description'),
        dataIndex: 'description',
        key: I18n.t('device.table.columns.description'),
        width: '40%',
        className: 'text-table',
        sorter: true,
        render: (text, dataRow) => (
          <>
            <Tooltip title={dataRow.description}>
              <p
                id="device-description"
                style={
                  dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
                }
              >
                {dataRow.description}
              </p>
            </Tooltip>
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
            <Tooltip
              title={
                dataRow.active
                  ? I18n.t('button.tooltip.disable')
                  : I18n.t('button.tooltip.enable')
              }
            >
              <Button
                icon={dataRow.active ? 'stop' : 'check'}
                type={dataRow.active ? 'danger' : 'success'}
                onClick={() => this.showDeleteConfirm(dataRow)}
                style={{
                  borderColor: dataRow.active
                    ? Colors.REMOVE_BUTTON
                    : Colors.ENABLE_ITEM,
                  color: dataRow.active ? '' : Colors.ENABLE_ITEM
                }}
              />
            </Tooltip>
          </>
        )
      }
    ],
    devices: {
      original: [],
      filtered: []
    },
    sorter: {
      order: 'ascend',
      field: 'name'
    },
    loading: true,
    search: null
  }

  async componentDidMount() {
    this.updateDevices(
      (await Services.Devices.listAll()).data.map(device => ({
        ...device,
        key: device._id
      }))
    )

    this.setState({ loading: false })
  }

  _sorter(data) {
    let ativos = data.filter(a => a.active)
    let inativos = data.filter(a => !a.active)

    if (_.isEqual(this.state.sorter.order, 'ascend')) {
      ativos = ativos.sort((data1, data2) =>
        data1[this.state.sorter.field].localeCompare(data2[this.state.sorter.field])
      )
      inativos = inativos.sort((data1, data2) =>
        data1[this.state.sorter.field].localeCompare(data2[this.state.sorter.field])
      )
    } else if (_.isEqual(this.state.sorter.order, 'descend')) {
      ativos = ativos.sort((data1, data2) =>
        data2[this.state.sorter.field].localeCompare(data1[this.state.sorter.field])
      )
      inativos = inativos.sort((data1, data2) =>
        data2[this.state.sorter.field].localeCompare(data1[this.state.sorter.field])
      )
    }

    return [...ativos, ...inativos]
  }

  handleSearch = event => {
    const search = event.target.value
    const valueClean = this.clearValueToSearch(search)
    const resultSearch = this.state.devices.original.filter(device =>
      this.clearValueToSearch(device.name).includes(valueClean)
    )

    this.setState({
      devices: {
        ...this.state.devices,
        filtered: resultSearch
      },
      search: search.slice(0, 50) // Caso a quantidade de caracteres no campo seja igual ou superior a 50, o último caractere é ignorado
    })
  }

  clearValueToSearch = value => {
    return value.trim().toLowerCase()
  }

  updateDevices = data => {
    data = this._sorter(data)

    this.setState({
      devices: {
        original: data,
        filtered: data
      }
    })
  }

  handleUserActived = (key, bool) => {
    this.updateDevices(
      this.state.devices.original.map(device => {
        if (device._id === key) {
          device.active = bool
        }

        return device
      })
    )
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
      keyboard: false,
      onOk: async () => {
        // caso esteja desativado e queira ativar ele faz o change
        const result = dataRow.active
          ? await Services.Devices.remove(dataRow.key)
          : await Services.Devices.update(dataRow.key, { active: true })

        if (result.data.ok) {
          this.handleUserActived(dataRow.key, !dataRow.active) // na logica é o que quero é inverter o status original
          openNotification('success', I18n.t(result.status.message))
        }
      }
    })
  }

  /**
   * função utilizada para ordenar os dados da tabela baseada no clique dos cabeçalhos
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ sorter })
    this.updateDevices(this.state.devices.original)
  }

  render() {
    const { devices, loading, columnsConfig } = this.state
    const headerStyle = {
      color: Colors.DARK_BLUE,
      marginBottom: 20
    }

    return (
      <>
        <Row type="flex" justify="space-between" style={headerStyle}>
          <Col style={{ fontSize: 21 }}>
            <Icon type="desktop" style={{ marginRight: 8 }} />
            {I18n.t('device.title')}
          </Col>

          <Col>
            <Button ghost type="primary" style={{ marginRight: 10 }}>
              <Link to="devices/register">
                <Icon type="plus-circle" /> {I18n.t('button.register')}
              </Link>
            </Button>{' '}
            <Input.Search
              placeholder={I18n.t('button.search.placeholder')}
              onChange={event => this.handleSearch(event)}
              style={{ width: 200 }}
              value={this.state.search}
            />
          </Col>
        </Row>

        <Card>
          <Table
            columns={columnsConfig}
            dataSource={devices.filtered}
            pagination={{
              pageSize: 10,
              total: this.state.devices.length,
              showTotal: total => `${I18n.t('device.data.total')}: ${total}`
            }}
            loading={loading}
            locale={{ emptyText: <CustomEmpty /> }}
            onChange={this.handleTableChange}
          />
        </Card>
      </>
    )
  }
}
