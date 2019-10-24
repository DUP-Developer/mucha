import React, { Component } from 'react'
import { Icon, Table, Card, Button, Input, Row, Col, Modal, Tooltip } from 'antd'
import moment from 'moment'
import Colors from '../../../Utils/Themes/Colors'
import { Link } from 'react-router-dom'
import Services from '../../../Services'
import I18n from '../../../i18n'

// COMPONENT
import openNotification from '../../../Utils/OpenNotification'
import WrappedModalFormUser from './../../modal/WrappedModalFormUser'
import CustomEmpty from './../../Components/CustomEmpty'
import RangeDate from '../../Components/RangeDate'

export default class Users extends Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('report.table.columns.device'),
        dataIndex: 'device.name',
        key: I18n.t('report.table.columns.device'),
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {dataRow.device.name}
            </p>
          </>
        )
      },
      {
        title: I18n.t('report.table.columns.user'),
        dataIndex: 'user.name',
        key: I18n.t('report.table.columns.user'),
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {dataRow.user ? dataRow.user.name : ''}
            </p>
          </>
        )
      },
      {
        title: I18n.t('report.table.columns.date'),
        dataIndex: 'date',
        key: I18n.t('report.table.columns.date'),
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {moment(dataRow.date).format(I18n.t('general.format.date'))}
            </p>
          </>
        )
      },
      {
        title: I18n.t('report.table.columns.consistency'),
        dataIndex: 'consistency',
        key: I18n.t('report.table.columns.consistency'),
        className: 'text-table',
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {(dataRow.consistency).toFixed(4) * 100}%
            </p>
          </>
        )
      },
      {
        title: I18n.t('report.table.columns.actions'),
        key: I18n.t('report.table.columns.actions'),
        render: (text, dataRow) => (
          <>
            { dataRow.active && 
            <Tooltip title={ I18n.t('button.tooltip.view') }>
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
                  pathname: `reports/detail/${dataRow._id}`,
                  state: { ...dataRow }
                }}
              >
                <Icon
                  className="hover-edit-icon"
                  type="eye"
                  style={{
                    color: Colors.YELLOW_ICON_EDIT,
                    borderColor: Colors.YELLOW_ICON_EDIT
                  }}
                />
              </Link>
            </Tooltip>
            }

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
                  color: dataRow.active ? '' : Colors.ENABLE_ITEM
                }}
              />
            </Tooltip>
          </>
        )
      }
    ],
    reports: {
      original: [],
      filtered: []
    },
    userFocus: {},
    visible: false,
    search: null
  }

  async componentDidMount() {
    const data = (await Services.Report.listAll()).data.map(report => ({
      ...report,
      key: report._id
    }))

    this.setState({
      reports: {
        original: data,
        filtered: data
      }
    })
  }

  handleReportActived = (key, bool) => {
    const data = this.state.reports.original
    .map(report => {
      if (report.key === key) {
        report.active = bool
      }

      return report
    })
    .sort(report => (report.active) ? -1 : 1)

    this.setState({
      reports: {
        original: data,
        filtered: data
      }
    })
  }

  showDeleteConfirm(dataRow) {
    Modal.confirm({
      title: dataRow.active
        ? I18n.t('report.modal.confirm.inactive')
        : I18n.t('report.modal.confirm.active'),
      content: dataRow.name,
      okText: I18n.t('button.yes'),
      okType: dataRow.active ? 'danger' : 'success',
      cancelText: I18n.t('button.no'),
      maskClosable: true,
      onOk: async () => {
        // caso esteja desativado e queira ativar ele faz o change
        const result = dataRow.active
          ? await Services.Report.remove(dataRow.key)
          : await Services.Report.update(dataRow.key, { active: true })

        if (result.data.ok) {
          this.handleReportActived(dataRow.key, !dataRow.active) // na logica é o que quero é inverter o status original
          openNotification('success',  I18n.t(result.status.message))
        }
      }
    })
  }

  handleSearch(event) {
    const search = event.target.value
    const valueClean = this.clearValueToSearch(search)
    const resultSearch = this.state.reports.original.filter(report => this.clearValueToSearch(report.device.name || '').includes(valueClean))

    this.setState({
      reports: {
        ...this.state.reports,
        filtered: resultSearch,
      },
      search: search.slice(0, 50) // Caso a quantidade de caracteres no campo seja igual ou superior a 50, o último caractere é ignorado
    })
  }

  clearValueToSearch(value) {
    return value.trim().toLowerCase()
  }

  handleFilter = filteredReports => {
    this.setState({
      reports:{
        ...this.state.reports,
        filtered: filteredReports
      }
    })
  }

  render() {
    const {
      visible,
      reports,
      userFocus,
      confirmLoading,
      columnsConfig
    } = this.state
    const headerStyle = {
      color: Colors.DARK_BLUE,
      marginBottom: 20
    }

    return (
      <>
        <Row type="flex" justify="space-between" style={headerStyle}>
          <Col style={{ fontSize: 21 }}>
            <Icon type="file" style={{ marginRight: 8 }} />
            {I18n.t('report.title.page')}
          </Col>

          <Col>
            <RangeDate handleFilter={ this.handleFilter } data={this.state.reports} />
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
            dataSource={reports.filtered}
            pagination={{
              pageSize: 10,
              total: reports.filtered.length,
              showTotal: total => `Total: ${total}`
            }}
            loading={confirmLoading}
            locale={{ emptyText: <CustomEmpty /> }}
          />
        </Card>

        <WrappedModalFormUser
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.hideModal}
          onCreate={this.handleSubmit}
          userFocus={userFocus}
          confirmLoading={confirmLoading}
          title={I18n.t('user.modal.title')}
          afterClose={this.afterCloseModal}
        />
      </>
    )
  }
}
