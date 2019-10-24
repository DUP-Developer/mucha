import React, { Component } from 'react'
import {Icon, Table, Card, Button, Row, Modal, Typography, Badge, Tooltip} from 'antd'

import Colors from '../../../Utils/Themes/Colors'
import Services from '../../../Services'
import I18n from '../../../i18n'
import openNotification from '../../../Utils/OpenNotification'
import '../Devices/device.css'
import CustomEmpty from '../../Components/CustomEmpty'
import WrappedModalFormUser from '../../modal/WrappedModalFormUser'

export default class Users extends Component {
  state = {
    columnsConfig: [
      {
        title: I18n.t('user.table.columns.name'),
        dataIndex: 'name',
        key: I18n.t('user.table.columns.name'),
        width: '30%',
        render: (text, dataRow) => (
          <>
            <p
              style={dataRow.active ? { color: '#1c1c1c' } : { color: '#777777' }}
            >
              {dataRow.name}
            </p>
          </>
        )
      },
      {
        title: I18n.t('user.table.columns.userType'),
        key: I18n.t('user.table.columns.userType'),
        width: '30%',
        render: (text, dataRow) => (
          <Badge
            style={
              dataRow.active
                ? { color: 'white', backgroundColor: this.userTypeBackground(dataRow.userType) }
                : { color: '#fafafa', backgroundColor: '#777777' }
            }
            count={I18n.t(`user.data.profiles.${dataRow.userType}`).toUpperCase()}
          />
        )
      },
      {
        title: I18n.t('user.table.columns.action'),
        key: I18n.t('user.table.columns.action'),
        width: '30%',
        render: (text, dataRow) => (
          <>
            <div className='box-button-edit-dashboard'>
              <Tooltip title={I18n.t('button.tooltip.edit')}>
                <Button
                  icon='edit'
                  onClick={() => this.showModal(dataRow)}
                />
              </Tooltip>
            </div>
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
    users: [],
    loading: true,
    userFocus: {},
  }

  async componentDidMount() {
    this.getUsers()

    this.setState({ loading: false })
  }

  userTypeBackground = type => {
    if (type === 'admin') return 'rgb(82, 196, 26)'
    return 'rgb(51, 153, 255)'
  }

  getUsers = async () => {
    const users = (await Services.Users.listAll()).data
      .slice(0, 5)
      .map(device => ({
        ...device,
        key: device._id
      }))
      .sort(user => (user.active) ? -1 : 1)

    this.setState({
      users
    })
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

      values.userType = (values.group.toLocaleLowerCase() === 'engenheiro' ? 'engineer' : 'admin')
      delete values.group

      // Removendo os espaços no inicio e no final no nome
      values = { ...values, name: values.name.trim() }

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
          const updateUsers = users.map(user => {
            if (user.key === userFocus.key) {
              return { ...userFocus, ...values, key: userFocus.key }
            }
            return user
          })

          this.setState({users: updateUsers})
        }
        else {
          const updateUsers = [
            { ...result.data, key: result.data._id },
            ...users.slice(0, 4) // Caso a quantidade de usuários no state seja igual a cinco, o último usuário é removido
          ]

          this.setState({ users: updateUsers })
        }

        openNotification('success',  I18n.t(result.status.message))
      }

      this.setState({
        visible: false,
        confirmLoading: false
      })
      form.resetFields()
    })
  }

  handleUserActived = (key, bool) => {
    const users = this.state.users
    .map(user => {
      if (user.key === key) {
        user.active = bool
      }

      return user
    })
    .sort(user => (user.active) ? -1 : 1)

    this.setState({users})
  }

  showDeleteConfirm = (dataRow) => {
    Modal.confirm({
      title: dataRow.active
        ? I18n.t('user.modal.confirm.inactive')
        : I18n.t('user.modal.confirm.active'),
      content: dataRow.name,
      okText: I18n.t('button.yes'),
      okType: 'danger',
      cancelText: I18n.t('button.no'),
      maskClosable: true,
      onOk: async () => {
        // caso esteja desativado e queira ativar ele faz o change
        const result = dataRow.active
          ? await Services.Users.remove(dataRow.key)
          : await Services.Users.update(dataRow.key, { ...dataRow, active: true })

        if (result.data.ok) {
          this.handleUserActived(dataRow.key, !dataRow.active) // na logica é o que quero é inverter o status original
          openNotification('success',  I18n.t(result.status.message))
        }
      }
    })
  }

  handleResetPassword = async () => {
    const result = await Services.Users.resetPassword(this.state.userFocus.key)

    if (result && result.data.ok) {
      openNotification('success',  I18n.t(result.status.message))
    }

    this.hideModal()
  }

  render() {
    const {
      loading,
      columnsConfig,
      users,
      userFocus,
      confirmLoading,
      visible,
    } = this.state

    return (
      <>
        <Card style={{ padding: '15px 10px' }}>
          <Row type='flex' justify='space-between' align='middle'>
            <Typography.Title
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 0
              }}
            >
              {I18n.t('dashboard.card.user.title')}
            </Typography.Title>

            <Button
              ghost
              type='primary'
              style={{ marginRight: 10 }}
              onClick={this.showModal}
            >
              <Icon type='plus-circle' /> {I18n.t('button.register')}
            </Button>{' '}
          </Row>
          <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

          <Table
            columns={columnsConfig}
            dataSource={users}
            pagination={false}
            loading={loading}
            locale={{emptyText: (<CustomEmpty />)}}
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
      </>
    )
  }
}
