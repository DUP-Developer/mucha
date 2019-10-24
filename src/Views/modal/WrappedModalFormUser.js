import React, { Component } from 'react' // eslint-disable-line
import { Modal, Form, Input, Select, Button } from 'antd' // eslint-disable-line
import InputPhone from '../../Utils/masks/InputPhone' // eslint-disable-line
import I18n from '../../i18n'
import _ from 'lodash'

const groups = [
  {
    label: I18n.t('user.data.profiles.admin'),
    key: 'admin'
  },
  {
    label: I18n.t('user.data.profiles.engineer'),
    key: 'engenheiro'
  }
]

class WrappedModalFormUser extends Component {
  getButtonsToFooter = () => {
    const { userFocus, onCreate, onCancel, handleResetPassword } = this.props
    const buttons = []

    buttons.push(
      <Button key="cancel" onClick={onCancel}>
        {I18n.t('button.cancel')}
      </Button>
    )

    if (!_.isEmpty(userFocus.key)) {
      buttons.push(
        <Button key="reset-password" onClick={() => handleResetPassword()}>
          {I18n.t('button.resetPassword')}
        </Button>
      )
    }

    buttons.push(
      <Button key="submit" type="primary" onClick={onCreate}>
        {I18n.t('button.save')}
      </Button>
    )

    return buttons
  }

  render() {
    const {
      visible,
      onCancel,
      onCreate,
      form,
      title,
      confirmLoading,
      userFocus,
      afterClose
    } = this.props
    const { getFieldDecorator } = form

    return (
      <Modal
        centered
        visible={visible}
        title={title}
        cancelText={I18n.t('button.cancel')}
        okText={I18n.t('button.save')}
        onCancel={onCancel}
        onOk={onCreate}
        confirmLoading={confirmLoading}
        afterClose={afterClose}
        footer={this.getButtonsToFooter()}
      >
        <Form layout="vertical">
          <Form.Item label={I18n.t('user.modal.form.fields.name.label')}>
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.name.rules.required')}
                    </p>
                  )
                },
                {
                  max: 50,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.name.rules.max')}
                    </p>
                  )
                },
                {
                  min: 3,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.name.rules.min')}
                    </p>
                  )
                },
                {
                  pattern: /\S/,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t(
                        'user.modal.form.fields.name.rules.patternWhiteSpace'
                      )}
                    </p>
                  )
                },
                {
                  pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, // verify if is alfabetic
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t(
                        'user.modal.form.fields.name.rules.patternInvalidCharacter'
                      )}
                    </p>
                  )
                }
              ],
              initialValue: userFocus.name
            })(<Input />)}
          </Form.Item>

          <Form.Item label={I18n.t('user.modal.form.fields.email.label')}>
            {getFieldDecorator('email', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.email.rules.required')}
                    </p>
                  )
                },
                {
                  min: 3,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.email.rules.min')}
                    </p>
                  )
                },
                {
                  max: 50,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.email.rules.max')}
                    </p>
                  )
                },
                {
                  pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.email.rules.pattern')}
                    </p>
                  )
                }
              ],
              // normalize: (value = '') => value.toLowerCase(),
              initialValue: userFocus.email
            })(<Input onChange={this.handleChange} />)}
          </Form.Item>

          <Form.Item label={I18n.t('user.modal.form.fields.phone.label')}>
            {getFieldDecorator('phone', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.phone.rules.required')}
                    </p>
                  )
                },
                {
                  pattern: /\(\d{2,}\) \d{4,}\s\d{4}/g,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.phone.rules.pattern')}
                    </p>
                  )
                }
              ],
              initialValue: userFocus.phone || ''
            })(<InputPhone />)}
          </Form.Item>

          <Form.Item label={I18n.t('user.modal.form.fields.profile.label')}>
            {getFieldDecorator('group', {
              initialValue: userFocus.userType
                ? I18n.t(`user.data.profiles.${userFocus.userType}`)
                : '',
              rules: [
                {
                  required: true,
                  message: (
                    <p style={{ marginBottom: 0 }}>
                      {I18n.t('user.modal.form.fields.profile.rules.required')}
                    </p>
                  )
                }
              ]
            })(
              <Select>
                {groups.map(group => (
                  <Select.Option key={group.key}>
                    {group.label.toUpperCase()}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default Form.create({ name: 'form_in_modal' })(WrappedModalFormUser)
