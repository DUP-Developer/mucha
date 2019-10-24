import React, { Component } from 'react'
import {Col, Form, Modal, Row, Transfer, Typography} from 'antd'
import I18n from '../../i18n'
import Services from '../../Services'
import FormScreen from '../Components/NavigationMap/FormScreen'
import Colors from "../../Utils/Themes/Colors";
import CustomEmpty from "../Components/CustomEmpty";

class ModalNewScreen extends Component {
  state = {
    targetKeys: [],
    items: [],
    itemsOfScreen: []
  }

  getAllItems = async () => {
    const data = (await Services.Items.listAll()).data

    const items = data.map(item => ({
      key: item._id,
      title: item.name,
      description: item.description
    }))

    this.setState({ items })
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
    let shouldUpdate = this.props.visible !== nextProps.visible

    if (shouldUpdate) {
      await this.getAllItems()
      this.setState({
        itemsOfScreen: []
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
      handleNewScreen
    } = this.props

    const { itemsOfScreen, items } = this.state

    return (
      <Modal
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={() => hideModal('newScreen')}
        confirmLoading={confirmLoading}
        destroyOnClose
        onOk={() => handleNewScreen(itemsOfScreen)}
        width={1200}
        className="new-screen"
      >
        <Row type="flex" justify="center">
          <Col span={10}>
            <Typography.Text
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 18
              }}
            >
              {I18n.t('mapNavigation.form.title')}
            </Typography.Text>
            <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />
            <FormScreen {...this.props} />
          </Col>

          <Col span={13} style={{ paddingLeft: 50 }}>
            <Typography.Text
              level={4}
              style={{
                color: Colors.DARK_BLUE,
                fontWeight: 'bold',
                fontSize: 18
              }}
            >
              {I18n.t('mapNavigation.transfer.title')}
            </Typography.Text>
            <hr style={{ border: `0.5px solid ${Colors.MID_BLUE}` }} />

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
                width: '45%',
                height: 370
              }}
              targetKeys={itemsOfScreen}
              onChange={this.handleChange}
              render={this.renderItem}
              locale={{notFoundContent: (<CustomEmpty />)}}
            />
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default Form.create({ name: 'modal_new_screen' })(ModalNewScreen)
