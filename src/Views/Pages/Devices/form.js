import React, { Component } from 'react'
import {Form, Input} from 'antd'
import I18n from '../../../i18n'

/**
 * Atributos
 *
 * - labelButton : adiciona o nome do butão de save
 *
 */
class DevicesForm extends Component {
  state = {
    loading: false,
    device: this.props.data
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
      }
    }

    return (
      <Form {...formItemLayout} layout="vertical">
        <Form.Item
          label={I18n.t('device.card.register.form.fields.name.label')}
        >
          {getFieldDecorator('name', {
            validateTrigger: ['onBlur', 'onChange'],
            rules: [
              {
                required: true,
                message: I18n.t(
                  'device.card.register.form.fields.name.rules.required'
                )
              },
              {
                pattern: /\S/,
                message: I18n.t(
                  'device.card.register.form.fields.name.rules.patternWhiteSpace'
                )
              },
              {
                pattern: /^[0-9A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, // verify if is alfabetic
                message: I18n.t('device.card.register.form.fields.name.rules.patternInvalidCharacter')
              },
              {
                max: 50,
                message: I18n.t(
                  'device.card.register.form.fields.name.rules.max'
                )
              }
            ],
            initialValue: this.state.device.name || ''
          })(<Input />)}
        </Form.Item>

        <Form.Item
          label={I18n.t('device.card.register.form.fields.description.label')}
        >
          {getFieldDecorator('description', {
            validateTrigger: ['onBlur', 'onChange'],
            rules: [
              {
                pattern: /\S/,
                message: I18n.t(
                  'device.card.register.form.fields.description.rules.pattern'
                )
              },
              {
                max: 500,
                message: I18n.t(
                  'device.card.register.form.fields.description.rules.max'
                )
              }
            ],
            initialValue: this.state.device.description || ''
          })(<Input.TextArea style={{ resize: 'none', height: '8em' }} />)}
        </Form.Item>
      </Form>
    )
  }
}

export default Form.create({ name: 'devices_form' })(DevicesForm)
