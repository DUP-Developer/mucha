import React from 'react'
import {
  Button,
  Card,
  Icon,
  Row,
  Table,
  Modal,
  Typography,
  Tooltip
} from 'antd'
import I18n from '../../../i18n'
import moment from 'moment'
import { Link } from 'react-router-dom'
import CustomEmpty from '../../Components/CustomEmpty'
import Colors from '../../../Utils/Themes/Colors'
import Services from '../../../Services'
import openNotification from '../../../Utils/OpenNotification'

export default class Reports extends React.Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('report.table.columns.device'),
        dataIndex: 'device.name',
        key: I18n.t('report.table.columns.device'),
        className: 'text-table',
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
        className: 'text-table',
        render: (text, dataRow) => (
          <p
            style={dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }}
          >
            {dataRow.user ? dataRow.user.name : ''}
          </p>
        )
      },
      {
        title: I18n.t('report.table.columns.date'),
        key: I18n.t('report.table.columns.date'),
        className: 'text-table',
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
            <Tooltip title={I18n.t('button.tooltip.view')}>
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
    reports: []
  }

  handleReportActived = (key, bool) => {
    const reports = this.state.reports
    .map(report => {
      if (report.key === key) {
        report.active = bool
      }

      return report
    })
    .sort(report => (report.active) ? -1 : 1)

    this.setState({
      reports
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
          openNotification('success', I18n.t(result.status.message))
        }
      }
    })
  }

  componentDidMount() {
    this.getDevices()

    this.setState({ loading: false })
  }

  async getDevices() {
    const reports = (await Services.Report.listAll()).data
      .slice(0, 5)
      .map(report => ({
        ...report,
        key: report._id
      }))
    this.setState({
      reports
    })
  }

  render() {
    return (
      <>
        <Card style={{ padding: '15px 10px', minHeight: 420 }}>
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
              {I18n.t('dashboard.card.report.title')}
            </Typography.Title>
          </Row>
          <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

          <Table
            columns={this.state.columnsConfig}
            dataSource={this.state.reports}
            pagination={false}
            // loading={loading}
            locale={{ emptyText: <CustomEmpty /> }}
            style={{ borderBottom: 'none' }}
          />
        </Card>
      </>
    )
  }
}
