import React, { Component } from 'react'
import { Typography, Row, Button, Upload, Col } from 'antd'
import Colors from '../../../Utils/Themes/Colors'
import './index.css'
import I18n from '../../../i18n'
import ModalGenerateTree from '../../Pages/Devices/modal/generateTree'
import ModalEditScreen from '../../modal/ModalEditScreen'
import openNotification from '../../../Utils/OpenNotification'
import Map from './Map'
import Services from '../../../Services'
import _ from 'lodash'
import ModalEditItemToScreen from '../../modal/ModalEditItemToScreen'
import ModalNewScreen from '../../modal/ModalNewScreen'
import MapNavigationTemp from '../../../Utils/MapNavigationTemp'
import { Prompt } from 'react-router-dom'

class BoxMapNavigationStart extends React.Component {
  state = {
    loadding: false,
    mapNavigation: {}
  }

  beforeUpload = file => {
    const { validateJsonFormat, validateTree } = this.props

    const reader = new FileReader()

    reader.onload = async e => {
      if (validateJsonFormat(e.target.result)) {
        const tree = JSON.parse(e.target.result)
        const errors = validateTree([tree])

        if (!errors.length) {
          const result = await Services.MapNavigation.getRoot({ ...tree })

          if (result) {
            const mapNavigation = await Services.MapNavigation.getMapNavigation(
              result.data._id
            )
            openNotification(
              'success',

              I18n.t(result.status.message)
            )

            // avisando a aplicação que tem um mapa de navegação a ser salvo
            MapNavigationTemp.set(result.data._id)
            this.props.handleBlocking(true)

            this.setState({ loading: false, mapNavigation })
          }
        }
      }
    }

    reader.readAsText(file)

    // Prevent upload
    return false
  }

  async shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = this.state.mapNavigation !== nextState.mapNavigation

    if (shouldUpdate) {
      await this.props.updateState(nextState.mapNavigation._id)
    }

    return shouldUpdate
  }

  render() {
    const { showGenerateTree } = this.props

    return (
      <>
        <div
          style={{
            width: '45%',
            display: 'flex',
            justifyContent: 'flex-end',
            minHeight: 200,
            alignItems: 'center'
          }}
        >
          <Button
            icon='plus'
            style={{
              color: Colors.DARK_BLUE,
              borderColor: Colors.DARK_BLUE
            }}
            onClick={() => showGenerateTree('generateTree')}
          >
            {I18n.t('button.generateNew')}
          </Button>
        </div>

        <div
          style={{
            width: '45%',
            marginLeft: '5%',
            display: 'flex',
            minHeight: 200,
            alignItems: 'center'
          }}
        >
          <Upload
            accept='.json'
            showUploadList={false}
            beforeUpload={this.beforeUpload}
          >
            <Button
              style={{ color: Colors.DARK_BLUE, borderColor: Colors.DARK_BLUE }}
              icon='upload'
              onClick={() => {
                this.setState({ loading: this.state.loading })
              }}
              loading={this.state.loading}
            >
              {I18n.t('button.import')}
            </Button>
          </Upload>
        </div>
      </>
    )
  }
}

export default class extends Component {
  state = {
    tree: null,
    wizard: [],
    showModal: {
      generateTree: false,
      edit: false,
      data: [],
      editItemToScreen: false,
      newScreen: false
    },
    loading: false,
    screens: [],
    screenParent: null,
    selectedScreen: null,
    hash: [],
    imageBase64: null
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.data.mapNavigation)) {
      this.getMapNavigation()

      this.setState({
        selectedScreen: this.props.data.mapNavigation
      })
    }
    this.getWizard()
  }

  updateState = async id => {
    let data
    if (this.state.tree){
      data = await Services.MapNavigation.getMapNavigation(
        this.state.tree._id
      )
    }else if (id){
      data = await Services.MapNavigation.getMapNavigation(
        id
      )
    }
    const selected = id || this.state.tree
    this.setState({ tree: data, selectedScreen: selected })
    this.props.handleMapNavigation(data)
  }

  getWizard = async () => {
    const data = await Services.MapNavigation.getWizard()
    this.setState({
      wizard: data
    })
  }

  getMapNavigation = async () => {
    const data = await Services.MapNavigation.getMapNavigation(
      this.props.data.mapNavigation
    )

    this.props.handleMapNavigation(data)
    this.setState({
      tree: data
    })
  }

  showModal = (modal, data = undefined) => {
    if (data) {
      this.setState({ selectedScreen: data })
    }

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

  /**
   * Função recursiva que varre o json utilizado
   * na função acima, retornando um novo json contendo
   * os itens marcados pelo usuário
   */
  generateTree = (tree, checkedKeys, data = []) => {
    tree.forEach(item => {
      if (checkedKeys.includes(item.key)) {
        data.push({ ...item, label: item.title, children: [] })
      }

      if (item.children) {
        return this.generateTree(
          item.children,
          checkedKeys,
          data.length ? data[data.length - 1].children : []
        )
      }
    })

    return data
  }

  validateJsonFormat = str => {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  }

  validateTree = (tree, errors = []) => {
    tree.forEach(item => {
      let error = {}

      if (!_.isString(item.label)) {
        error[item.label] = {
          ...error[item.label],
          label: 'A chave label não é do tipo string'
        }
      }

      if (!_.isString(item.description)) {
        error[item.label] = {
          ...error[item.label],
          description: 'A chave description não é do tipo string'
        }
      }

      if (!_.isArray(item.items)) {
        error[item.label] = {
          ...error[item.label],
          items: 'A chave items não é do tipo object'
        }
      }

      if (!_.isArray(item.children)) {
        error[item.label] = {
          ...error[item.label],
          children: 'A chave children não é do tipo object'
        }
      }

      if (Object.entries(error).length) errors.push(error)

      if (item.children) {
        this.validateTree(item.children, errors)
      }
    })

    return errors
  }

  saveTree = tree => {
    this.props.handleMapNavigation(tree)
    this.setState({
      tree
    })
  }

  handleSelected = data => {
    this.setState({
      selectedScreen: data,
      screenParent: this.state.hash[data.parent]
    })
  }

  handleEditScreen = () => {
    const form = this.editScreenFormRef.props.form

    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      const data = { ...this.state.selectedScreen, ...values, image: this.state.imageBase64 }
      delete data.__v
      delete data._id

      const result = await Services.Screen.update(
        this.state.selectedScreen._id,
        data
      )

      if (result && result.status.success) {
        await this.updateState()
        openNotification('success',  I18n.t(result.status.message))
      }

      form.resetFields()
      this.hideModal('edit')
    })
  }

  handleEditItemToScreen = async (itemsOfScreen, itemsDeleted = []) => {
    itemsOfScreen = itemsOfScreen.filter(itemOfScreen => {
      const result = itemsDeleted.find(itemDeleted => itemDeleted === itemOfScreen)

      if (!result) {
        return itemOfScreen
      }
    })

    const selectedScreenId =
      typeof this.state.selectedScreen === 'object'
        ? this.state.selectedScreen._id
        : this.props.data.mapNavigation

    const result = await Services.Screen.updateItemsOfScreen(
      selectedScreenId,
      itemsOfScreen
    )

    if (result && result.status.success) {
      openNotification('success',  I18n.t(result.status.message))
      
      const screen = await Services.MapNavigation.getMapNavigation(selectedScreenId)
      if(screen){
        await this.updateState(screen)
      }else{
        await this.updateState()
      }

      this.hideModal('editItemToScreen')
    }
  }

  handleNewScreen = async itemsOfScreen => {
    const form = this.addScreenFormRef.props.form
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      const result = await Services.Screen.createChildrenScreen(values.parent, {
        ...values,
        image: this.state.imageBase64,
        items: itemsOfScreen
      })

      if (result && result.status.success) {
        openNotification('success',  I18n.t(result.status.message))
        form.resetFields()
        await this.updateState(result.data)
        this.hideModal('newScreen')
      } else {
        form.resetFields()
        this.hideModal('newScreen')
      }
    })
  }

  saveFormRef = formRef => {
    if (formRef) {
      if (formRef.props.formName === 'newScreen') {
        this.addScreenFormRef = formRef
      } else {
        this.editScreenFormRef = formRef
      }
    }
  }

  handleBase64 = (imageBase64) => {
    this.setState({imageBase64})
  }

  buttonGenerateNew = () => {
    return (
      <Button
        type='primary'
        icon='plus'
        style={{
          marginRight: 10
        }}
        onClick={() => this.showModal('generateTree')}
      >
        {I18n.t('button.generateNew')}
      </Button>
    )
  }

  render() {
    const {
      showModal,
      loading,
      wizard,
      selectedScreen,
      hash
    } = this.state

    return (
      <>
        <Prompt
          when={this.props.blocking}
          message={I18n.t('mapNavigation.alert')}
        />

        <Row type='flex' justify='space-between' align='middle'>
          <Col>
            <Typography.Title
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 18,
                marginBottom: 0
              }}
            >
              {I18n.t('device.card.mapNavigation.title')}
            </Typography.Title>
          </Col>
        </Row>
        <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

        <Row type='flex' justify='space-between'>
          {!this.state.tree ? (
            <BoxMapNavigationStart
              showGenerateTree={this.showModal}
              validateJsonFormat={this.validateJsonFormat}
              validateTree={this.validateTree}
              updateState={this.updateState}
              loading={loading}
              handleBlocking={this.props.handleBlocking}
            />
          ) : (
            <Map
              data={[this.state.tree]}
              showModal={this.showModal}
              selectedScreen={this.state.selectedScreen}
              onSelect={data => this.handleSelected(data)}
              handleMapHash={data => {
                this.state.hash[data.id] = data.label // eslint-disable-line
              }}
              updateState={this.updateState}
            />
          )}
        </Row>

        <ModalGenerateTree
          title={I18n.t('device.card.mapNavigation.modal.generateTree.title')}
          visible={showModal.generateTree}
          dataSource={wizard}
          generateTree={this.generateTree}
          hideModal={this.hideModal}
          loading={loading}
          getRoot={tree => this.saveTree(tree)}
          blockingScreen={this.props.handleBlocking}
        />

        <ModalEditScreen
          visible={showModal.edit}
          hideModal={this.hideModal}
          title={I18n.t('mapNavigation.modal.editScreen.title')}
          selectedScreen={this.state.selectedScreen}
          screens={hash}
          screenParent={
            _.isEmpty(selectedScreen) ? selectedScreen : selectedScreen.parent
          }
          handleCreate={this.handleEditScreen}
          wrappedComponentRef={this.saveFormRef}
          formName='editScreen'
          handleBase64={this.handleBase64}
        />

        <ModalEditItemToScreen
          visible={showModal.editItemToScreen}
          data={showModal.data}
          hideModal={this.hideModal}
          title={I18n.t('mapNavigation.modal.editItemToScreen.title')}
          handleEditItemToScreen={this.handleEditItemToScreen}
          selectedScreen={selectedScreen}
        />

        <ModalNewScreen
          visible={showModal.newScreen}
          hideModal={this.hideModal}
          title={I18n.t('mapNavigation.modal.newScreen.title')}
          handleNewScreen={this.handleNewScreen}
          screens={hash}
          selectedScreen={{}}
          screenParent={
            _.isEmpty(selectedScreen) ? selectedScreen : selectedScreen._id
          }
          wrappedComponentRef={this.saveFormRef}
          formName='newScreen'
          handleBase64={this.handleBase64}
        />
      </>
    )
  }
}
