import React from 'react'
import { Typography, Table, Divider, Tag, Badge } from 'antd' // eslint-disable-line
import i18n from '../../i18n'
import moment from 'moment'

export default class extends React.Component {
  state = {
    data: this.props.data
  }

  render() {
    const { data } = this.state
    return (
      <Table
        dataSource={[
          {
            device: data.device.name,
            descrption: data.device.descrption,
            user: data.user.name,
            date: data.date,
            consistency: `${(data.consistency * 100).toFixed(2)}%`
          }
        ]}
      >
        <Table.Column
          title={i18n.t('report.table.columns.device')}
          dataIndex="device"
          key="device"
        />
  
        <Table.Column
          title={i18n.t('report.table.title.user')}
          dataIndex="user"
          key="user"
        />
        <Table.Column
          title={i18n.t('report.table.columns.date')}
          dataIndex="date"
          key="date"
          render={(text, dataRow) => moment(text).format(i18n.t('general.format.date'))}
        />
        <Table.Column
          title={i18n.t('report.table.columns.consistency')}
          dataIndex="consistency"
          key="consistency"
          render={text => (
            <Typography.Title level={4} style={{ fontWeight: 'bold' }}>
              {text}
            </Typography.Title>
          )}
        />
      </Table>
    )
  }
}
