import React, { Component } from 'react'
import {
  Row,
  Tabs,
  Card,
  Button,
  Modal,
  Icon,
  Tooltip,
  Col,
  Input,
  Skeleton
} from 'antd'

import Colors from '../Utils/Themes/Colors'
import Services from '../Services'
import HeaderSection from './Components/HeaderSection'
import ItemTabContent from './Components/ItemTabContent'
import WrappedModalFormItem from './modal/WrappedModalFormItem'
import I18n from '../i18n'
import OpenNotification from '../Utils/OpenNotification'
import _ from 'lodash'
import CustomEmpty from './Components/CustomEmpty'

const TabPane = Tabs.TabPane

export class Items extends Component {
  state = {
    activeKey: '',
    showModal: {
      add: false,
      edit: false
    },
    panes: [],
    defaultPanes: [],
    loading: false,
    search: null
  }

  async componentDidMount() {
    this.showSkeleton()
    const items = await Services.Items.listAll()

    let panes = items.data.map(item => ({
      title: item.name,
      description: item.description,
      content: <ItemTabContent list={item.metrics} item={item} />,
      key: item._id,
      active: item.active,
      visible: true
    }))

    panes = this._sorter(panes)

    this.setState({
      activeKey: panes[0] ? panes[0].key : '',
      panes,
      defaultPanes: panes
    })
    this.showSkeleton()
  }

  _sorter(panes) {
    let ativos = panes.filter(a => a.active)
    let inativos = panes.filter(a => !a.active)

    ativos = _.sortBy(ativos, ['title'])
    inativos = _.sortBy(inativos, ['title'])

    return [...ativos, ...inativos]
  }

  showSkeleton = () => {
    this.setState({
      loading: !this.state.loading
    })
  }

  showModal = modal => {
    this.setState({
      showModal: {
        ...this.state.showModal,
        [modal]: true
      }
    })
  }

  hideModal = modal => {
    this.setState({
      showModal: {
        ...this.state.showModal,
        [modal]: false
      }
    })
  }

  onChange = activeKey => {
    this.setState({ activeKey })
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  saveFormRef = formRef => {
    if (formRef) {
      if (formRef.props.formName === 'add_item') {
        this.addFormRef = formRef
      } else {
        this.editFormRef = formRef
      }
    }
  }

  handleSearch = event => {
    const search = event.target.value
    const valueClean = this.clearValueToSearch(search)
    let resultSearch = this.state.defaultPanes.filter(item =>
      this.clearValueToSearch(item.title).startsWith(valueClean)
    )

    // area de presentaçlão quando o input esta vazio
    if (!resultSearch.length) {
      resultSearch = [
        {
          title: '',
          description: '',
          content: (
            <div
              style={{
                height: '35vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <CustomEmpty />
            </div>
          ),
          key: 'DG00000000000000',
          active: false,
          visible: false
        }
      ]
    }

    this.setState({
      panes: resultSearch,
      activeKey: resultSearch[0] ? resultSearch[0].key : 'DG00000000000000',
      search: search.slice(0, 100) // Caso a quantidade de caracteres no campo seja igual ou superior a 100, o último caractere é ignorado
    })
  }

  clearValueToSearch = value => {
    return value.trim().toLowerCase()
  }

  handleUpdate = async () => {
    const form = this.editFormRef.props.form
    const { defaultPanes, activeKey } = this.state

    form.validateFields(async (err, values) => {
      if (!err) {
        const updatedItem = {
          name: values.name,
          description: values.description,
          metrics: [],
          active: true
        }
        const response = await Services.Items.update(activeKey, updatedItem)
        if (response && response.status.success) {
          OpenNotification('success', I18n.t(response.status.message))
          const updatedPanes = defaultPanes.map(pane => {
            if (pane.key === activeKey) {
              pane.title = updatedItem.name
              pane.description = updatedItem.description
            }
            return pane
          })
          this.setState({
            panes: this._sorter(updatedPanes),
            defaultPanes: updatedPanes
          })
          this.hideModal('edit')
          form.resetFields()
        }
      }
    })
  }

  handleCreate = async () => {
    const form = this.addFormRef.props.form
    const { panes } = this.state

    form.validateFields(async (err, values) => {
      if (!err) {
        const newItem = {
          name: values.name,
          description: values.description,
          metrics: [],
          active: true,
          visible: true
        }
        const response = await Services.Items.create(newItem)
        if (response) {
          const activeKey = response.data._id
          panes.push({
            title: values.name,
            description: values.description,
            active: true,
            content: (
              <ItemTabContent
                list={response.data.metrics}
                item={response.data}
              />
            ),
            key: activeKey
          })
          this.setState({ panes: this._sorter(panes), activeKey })
          this.hideModal('add')
          form.resetFields()
        }
      }
    })
  }

  add = () => {
    this.showModal('add')
  }

  remove = targetKey => {
    let targetItem
    this.state.panes.forEach(item => {
      if (item.key === targetKey) {
        targetItem = item
      }
    })
    this.showDeleteConfirm(targetItem)
  }

  showDeleteConfirm(targetItem) {
    Modal.confirm({
      title: targetItem.active
        ? I18n.t('item.modal.confirm.inactive')
        : I18n.t('item.modal.confirm.active'),
      content: targetItem.title,
      okText: I18n.t('button.yes'),
      okType: targetItem.active ? 'danger' : 'success',
      cancelText: I18n.t('button.no'),
      onOk: async () => {
        await this.handleRemove(targetItem.key)
      }
    })
  }

  handleRemove = async targetKey => {
    let activeKey = targetKey
    let selectedPane
    const newPanes = this._sorter(
      this.state.panes.map(pane => {
        if (pane.key === targetKey) {
          pane.active = !pane.active
          selectedPane = pane
          pane.content = <ItemTabContent list={pane.metrics} item={pane} />
        }
        return pane
      })
    )

    //Chamada da API
    let response
    if (!selectedPane.active) {
      response = await Services.Items.remove(activeKey)
    } else {
      response = await Services.Items.update(selectedPane.key, {
        active: selectedPane.active
      })
    }

    if (response && response.status.success) {
      this.setState({ panes: this._sorter(newPanes) })
      OpenNotification(
        'success',
        selectedPane.active
          ? I18n.t('item.success.enable')
          : I18n.t(response.status.message)
      )
    }
  }

  render() {
    const headerStyle = {
      color: Colors.DARK_BLUE,
      marginBottom: '20px'
    }
    const { activeKey, search } = this.state

    return (
      <>
        <Row style={headerStyle} type="flex" justify="space-between">
          <Col>
            <HeaderSection title={I18n.t('item.title')} icon="check-square" />
          </Col>
          <Col>
            <Button
              ghost
              type="primary"
              style={{ marginRight: 10 }}
              icon="plus-circle"
              onClick={() => {
                this.showModal('add')
              }}
            >
              {I18n.t('button.register')}
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
          <Skeleton loading={this.state.loading} active>
            <Tabs
              style={{
                backgroundColor: Colors.WHITE,
                padding: '20px 5px 20px 5px',
                margin: '30px 10px 30px 10px'
              }}
              onChange={this.onChange}
              activeKey={activeKey}
              hideAdd
              onEdit={this.onEdit}
              tabPosition={'left'}
              prevIcon={null}
            >
              {this.state.panes.map(pane => (
                <TabPane
                  tab={
                    pane.visible ? (
                      <p
                        style={{
                          color: pane.active ? '' : Colors.DISABLE_ITEM,
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            direction: 'ltr',
                            width: '60%'
                          }}
                        >
                          <Tooltip title={pane.description} placement="topLeft">
                            {pane.title}
                          </Tooltip>
                        </span>
                        <span>
                          <Tooltip title={I18n.t('button.tooltip.edit')}>
                            <Icon
                              type={'edit'}
                              style={{
                                marginLeft: 10,
                                color: Colors.YELLOW_ICON_EDIT,
                                width: 16,
                                height: 16
                              }}
                              onClick={() => this.showModal('edit')}
                            />
                          </Tooltip>
                          <Tooltip
                            title={
                              pane.active
                                ? I18n.t('item.tooltip.disable')
                                : I18n.t('item.tooltip.enable')
                            }
                          >
                            <Icon
                              type={pane.active ? 'stop' : 'check-circle'}
                              style={{
                                marginLeft: 5,
                                color: `${
                                  pane.active
                                    ? Colors.REMOVE_BUTTON
                                    : Colors.ENABLE_ITEM
                                }`,
                                width: 16,
                                height: 16
                              }}
                              onClick={() => this.remove(pane.key)}
                            />
                          </Tooltip>
                        </span>
                      </p>
                    ) : null
                  }
                  key={pane.key}
                  closable={false}
                >
                  {pane.content}
                </TabPane>
              ))}
            </Tabs>
          </Skeleton>
        </Card>
        <WrappedModalFormItem
          title={I18n.t('item.modal.title.add')}
          wrappedComponentRef={formRef => this.saveFormRef(formRef)}
          visible={this.state.showModal.add}
          onCancel={() => this.hideModal('add')}
          onSubmit={this.handleCreate}
          formName="add_item"
        />
        <WrappedModalFormItem
          title={I18n.t('item.modal.title.edit')}
          wrappedComponentRef={formRef => this.saveFormRef(formRef)}
          visible={this.state.showModal.edit}
          onCancel={() => this.hideModal('edit')}
          onSubmit={this.handleUpdate}
          formName="edit_item"
          item={this.state.panes.filter(pane => pane.key === activeKey)[0]}
        />
      </>
    )
  }
}

export default Items
