import React, { Component } from 'react'
import { Form, Modal } from 'antd' // eslint-disable-line
import I18n from '../../i18n'
import FormScreen from '../Components/NavigationMap/FormScreen' // eslint-disable-line

class ModalEditScreen extends Component {
  render () {
    const {
      visible,
      title,
      confirmLoading,
      hideModal,
      handleCreate
    } = this.props

    return (
      <Modal
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={() => hideModal('edit')}
        confirmLoading={confirmLoading}
        destroyOnClose
        onOk={handleCreate}
      >
        <FormScreen {...this.props} />
      </Modal>
    )
  }
}

export default Form.create({ name: 'form_in_modal' })(ModalEditScreen)
