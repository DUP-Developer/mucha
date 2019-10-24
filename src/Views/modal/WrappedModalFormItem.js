import React from 'react'
import { Modal, Form, Input } from 'antd' // eslint-disable-line
import I18n from '../../i18n'

let formName
class WrappedModalFormItem extends React.Component {
  componentDidMount () {
    formName = this.props.formName
  }
  normalizeAll = (value, previousValue = []) =>{
    return value.substring(0,1).toUpperCase() + value.slice(1).toLowerCase()
  }
  render () {
    const { visible, onCancel, onSubmit, form, title, item } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        destroyOnClose
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={onCancel}
        onOk={onSubmit}
        maskClosable={false}
      >
        <Form layout="vertical">
          <Form.Item label={I18n.t('item.modal.form.fields.name.label')}>
            {getFieldDecorator('name', {
              // normalize: this.normalizeAll,
              rules: [
                {
                  required: true,
                  message: <p className={'validation-error-mesage'}>{I18n.t('item.modal.form.fields.name.rules.required')}</p>
                },
                {
                  pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇ 0-9]+$/, // verify if is alfanumeric
                  message: <p className={'validation-error-mesage'}>{I18n.t('item.modal.form.fields.name.rules.namePatern')}</p>
                },
                {
                  max: 100,
                  message: <p className={'validation-error-mesage'}>{I18n.t('item.modal.form.fields.name.rules.max')}</p>
                }
              ],
              initialValue: item ? item.title : ''
            })(<Input />)}
          </Form.Item>
          <Form.Item label={I18n.t('item.modal.form.fields.description.label')}>
            {getFieldDecorator('description', {
              rules: [
                {
                  max: 500,
                  message: I18n.t(
                    'item.modal.form.fields.description.rules.max'
                  )
                }
              ],
              initialValue: item ? item.description : ''
            })(<Input.TextArea style={{ minHeight: '150px' }} />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: formName })(WrappedModalFormItem)
