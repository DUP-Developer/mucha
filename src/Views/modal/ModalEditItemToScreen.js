import React, { Component } from 'react'
import {Form, Modal, Transfer, Typography} from 'antd'
import I18n from '../../i18n'
import Services from '../../Services'
import CustomEmpty from "../Components/CustomEmpty";
import Colors from "../../Utils/Themes/Colors";

class ModalEditItemToScreen extends Component {
  state = {
    targetKeys: [],
    items: [],
    itemsOfScreen: [],
    itemsDeleted: []
  }

  getAllItems = async () => {
    const data = (await Services.Items.listAll()).data.filter(item => item.active)

    const items = data.map(item => ({
      key: item._id,
      title: item.name,
      description: item.description
    }))

    this.setState({ items })
  }

  getItemsOfScreen = async () => {
    if (this.props.selectedScreen) {
      let itemsOfScreen = []

      if (this.props.selectedScreen.items) {
        itemsOfScreen = this.props.selectedScreen.items.map(itemOfSelectedScreen => {
          const item = this.state.items.find(itemDB => itemOfSelectedScreen.name === itemDB.title)
          if (item) {
            return item.key
          }

          return itemOfSelectedScreen.idOrigin
        })
      }

      this.setState({ itemsOfScreen })
    }
  }

  handleChange = targetKeys => {
    this.setState({
      itemsOfScreen: targetKeys
    })
  }

  renderItem = item => {
    const customLabel = (
      <span className="custom-item">
        {item.title}
      </span>
    )

    return {
      label: customLabel, // for displayed item
      value: item.title // for title and filter matching
    }
  }

  async shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate = this.props.visible !== nextProps.visible

    if (shouldUpdate && nextProps.visible) {
      await this.getAllItems()
      await this.getItemsOfScreen()

      this.setState({
        itemsDeleted: []
      })
    }

    return shouldUpdate
  }

  render() {
    const {
      visible,
      title,
      confirmLoading,
      hideModal,
      handleEditItemToScreen
    } = this.props

    const { itemsOfScreen, items, itemsDeleted } = this.state

    return (
      <Modal
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={() => hideModal('editItemToScreen')}
        confirmLoading={confirmLoading}
        destroyOnClose
        onOk={() => handleEditItemToScreen(itemsOfScreen, itemsDeleted)}
        width={700}
        className={'edit-item-to-screen'}
      >
        <div id='transfer-title'>
          <Typography.Text
            level={4}
            style={{
              color: Colors.DARK_BLUE,
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {I18n.t('mapNavigation.transfer.left')}
          </Typography.Text>

          <Typography.Text
            level={4}
            style={{
              color: Colors.DARK_BLUE,
              fontWeight: 'bold',
              fontSize: 18
            }}
          >
            {I18n.t('mapNavigation.transfer.right')}
          </Typography.Text>
        </div>

        <Transfer
          dataSource={items}
          listStyle={{
            width: 300,
            height: 300
          }}
          targetKeys={itemsOfScreen}
          onChange={this.handleChange}
          render={this.renderItem}
          locale={{notFoundContent: (<CustomEmpty />)}}
        />
      </Modal>
    )
  }
}

export default Form.create({ name: 'form_in_modal' })(ModalEditItemToScreen)
