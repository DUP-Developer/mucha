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
  Badge,
  Tooltip
} from 'antd'

import Colors from '../Utils/Themes/Colors'
import Services from '../Services'
import WrappedModalFormUser from './modal/WrappedModalFormUser'
import openNotification from '../Utils/OpenNotification'
import I18n from '../i18n'
import CustomEmpty from './Components/CustomEmpty'
import _ from 'lodash'

export default class Users extends Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('user.table.columns.name'),
        dataIndex: 'name',
        key: I18n.t('user.table.columns.name'),
        // sorter: true,
        sorter: true,
        // sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
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
        title: I18n.t('user.table.columns.email'),
        dataIndex: 'email',
        key: I18n.t('user.table.columns.email'),
        sorter: true,
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {dataRow.email}
            </p>
          </>
        )
      },
      {
        title: I18n.t('user.table.columns.phone'),
        dataIndex: 'phone',
        key: I18n.t('user.table.columns.phone'),
        sorter: true,
        render: (text, dataRow) => (
          <>
            <p
              style={
                dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }
              }
            >
              {dataRow.phone ? dataRow.phone : '---'}
            </p>
          </>
        )
      },
      {
        title: I18n.t('user.table.columns.userType'),
        key: I18n.t('user.table.columns.userType'),
        dataIndex: 'userType',
        sorter: true,
        render: (text, dataRow) => (
          <Badge
            style={
              dataRow.active
                ? {
                    color: 'white',
                    backgroundColor: this.userTypeBackground(dataRow.userType)
                  }
                : { color: '#fafafa', backgroundColor: '#777777' }
            }
            count={I18n.t(
              `user.data.profiles.${dataRow.userType}`
            ).toUpperCase()}
          />
        )
      },
      {
        title: I18n.t('user.table.columns.action'),
        key: I18n.t('user.table.columns.action'),
        render: (text, dataRow) => (
          <>
            <Tooltip title={I18n.t('button.tooltip.edit')}>
              <Button
                icon="edit"
                onClick={() => this.showModal(dataRow)}
                style={{
                  color: Colors.YELLOW_ICON_EDIT,
                  marginRight: 10,
                  borderColor: Colors.YELLOW_ICON_EDIT
                }}
              />
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
    users: {
      original: [],
      filtered: []
    },
    userFocus: {},
    visible: false,
    search: null,
    sorter: {
      order: 'ascend',
      field: 'name'
    }
  }

  async componentDidMount() {
    this.updateUsers(
      (await Services.Users.listAll()).data
        .map(user => ({
          ...user,
          key: user._id
        }))
        .sort(user => (user.active ? -1 : 1))
    )
  }

  userTypeBackground = type => {
    if (type === 'admin') return 'rgb(82, 196, 26)'
    return 'rgb(51, 153, 255)'
  }

  showModal = (dataRow = {}) => {
    this.setState({
      visible: true,
      userFocus: dataRow
    })
  }

  hideModal = () => {
    this.setState({ visible: false })
  }

  afterCloseModal = () => {
    this.formRef.props.form.resetFields()
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  handleSubmit = () => {
    const form = this.formRef.props.form
    const { users, userFocus } = this.state

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      values.userType =
        values.group.toLocaleLowerCase() === 'engenheiro' ? 'engineer' : 'admin'
      delete values.group

      // Removendo os espaços no inicio e no final no nome
      values = {
        ...values,
        name: values.name.trim(),
        email: values.email.toLowerCase()
      }

      this.setState({ confirmLoading: true })

      /**
       * Se a propriedade key existir no objeto userFocus
       * a ação a ser executada será de edição, caso contrário será de inserção
       */
      const result = userFocus.key
        ? await Services.Users.update(userFocus.key, { ...values })
        : await Services.Users.create({ ...values })

      if (result) {
        /**
         * Se a propriedade ok for verdadeira em result.data, significa que houve uma edição do usuário com sucesso
         * caso contrário houve inserção
         */
        if (result.data.ok) {
          this.updateUsers(
            users.original
              .map(user => {
                if (user.key === userFocus.key) {
                  return { ...userFocus, ...values, key: userFocus.key }
                }
                return user
              })
              .sort(user => (user.active ? -1 : 1))
          )
        } else {
          this.updateUsers(
            [{ ...result.data, key: result.data._id }, ...users.original].sort(
              user => (user.active ? -1 : 1)
            )
          )
        }

        openNotification('success', I18n.t(result.status.message))
      }

      this.setState({
        visible: false,
        confirmLoading: false
      })
      form.resetFields()
    })
  }

  handleUserActived = (key, bool) => {
    this.updateUsers(
      this.state.users.original
        .map(user => {
          if (user.key === key) {
            user.active = bool
          }

          return user
        })
        .sort(user => (user.active ? -1 : 1))
    )
  }

  showDeleteConfirm(dataRow) {
    Modal.confirm({
      title: dataRow.active
        ? I18n.t('user.modal.confirm.inactive')
        : I18n.t('user.modal.confirm.active'),
      content: dataRow.name,
      okText: I18n.t('button.yes'),
      okType: 'danger',
      cancelText: I18n.t('button.no'),
      mask: true,
      keyboard: false,
      onCancel: () => {
        console.log('clicked')
      },
      onOk: async () => {
        // caso esteja desativado e queira ativar ele faz o change
        const result = dataRow.active
          ? await Services.Users.remove(dataRow.key)
          : await Services.Users.update(dataRow.key, {
              ...dataRow,
              active: true
            })

        if (result.data.ok) {
          this.handleUserActived(dataRow.key, !dataRow.active) // na logica é o que quero é inverter o status original
          openNotification('success', I18n.t(result.status.message))
        }
      }
    })
  }

  handleSearch(event) {
    const search = event.target.value
    const valueClean = this.clearValueToSearch(search)

    const resultSearch = this.state.users.original.filter(user => {
      return (
        this.clearValueToSearch(user.name || '').includes(valueClean) ||
        this.clearValueToSearch(user.email || '').includes(valueClean) ||
        this.clearValueToSearch(user.phone || '').includes(valueClean) ||
        this.clearValueToSearch(
          I18n.t(`user.data.profiles.${user.userType}`) || ''
        ).includes(valueClean)
      )
    })

    this.setState({
      users: {
        ...this.state.users,
        filtered: resultSearch
      },
      search: search.slice(0, 50) // Caso a quantidade de caracteres no campo seja igual ou superior a 50, o último caractere é ignorado
    })
  }

  clearValueToSearch(value) {
    return value.trim().toLowerCase()
  }

  updateUsers(data) {
    let ativos = data.filter(a => a.active)
    let inativos = data.filter(a => !a.active)

    if (_.isEqual(this.state.sorter.order, 'ascend')) {
      ativos = ativos.sort((data1, data2) =>
        data1[this.state.sorter.field].localeCompare(
          data2[this.state.sorter.field]
        )
      )
      inativos = inativos.sort((data1, data2) =>
        data1[this.state.sorter.field].localeCompare(
          data2[this.state.sorter.field]
        )
      )
    } else if (_.isEqual(this.state.sorter.order, 'descend')) {
      ativos = ativos.sort((data1, data2) =>
        data2[this.state.sorter.field].localeCompare(
          data1[this.state.sorter.field]
        )
      )
      inativos = inativos.sort((data1, data2) =>
        data2[this.state.sorter.field].localeCompare(
          data1[this.state.sorter.field]
        )
      )
    }

    this.setState({
      users: {
        original: [...ativos, ...inativos],
        filtered: [...ativos, ...inativos]
      }
    })
  }

  /**
   * função utilizada para ordenar os dados da tabela baseada no clique dos cabeçalhos
   */
  handleTableChange = (pagination, filters, sorter) => {
    this.setState({ sorter })    
    this.updateUsers(this.state.users.original)
  }

  handleResetPassword = async () => {
    const result = await Services.Users.resetPassword(this.state.userFocus.key)

    if (result && result.data.ok) {
      openNotification('success', I18n.t(result.status.message))
    }

    this.hideModal()
  }

  render() {
    const {
      visible,
      users,
      userFocus,
      confirmLoading,
      columnsConfig,
      search
    } = this.state
    const headerStyle = {
      color: Colors.DARK_BLUE,
      marginBottom: 20
    }

    return (
      <div>
        <Row type="flex" justify="space-between" style={headerStyle}>
          <Col style={{ fontSize: 21 }}>
            <Icon type="user" />
            {I18n.t('user.title')}
          </Col>

          <Col>
            <Button
              ghost
              type="primary"
              style={{ marginRight: 10 }}
              onClick={this.showModal}
            >
              <Icon type="plus-circle" /> {I18n.t('button.register')}
            </Button>{' '}
            <Input.Search
              placeholder={I18n.t('button.search.placeholder')}
              onChange={event => this.handleSearch(event)}
              style={{ width: 200 }}
              value={search}
            />
          </Col>
        </Row>

        <Card>
          <Table
            columns={columnsConfig}
            dataSource={users.filtered}
            pagination={{
              pageSize: 10,
              total: this.state.users.filtered.length,
              showTotal: total => `${I18n.t('user.data.total')}: ${total}`
            }}
            loading={confirmLoading}
            locale={{ emptyText: <CustomEmpty /> }}
            onChange={this.handleTableChange}
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
          handleResetPassword={() => this.handleResetPassword()}
        />
      </div>
    )
  }
}
