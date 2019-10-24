import React, { Component } from 'react'
import { Form, Input, Row, Button, Typography } from 'antd'
import InputPhone from '../../../Utils/masks/InputPhone'
import Auth from '../../../Utils/Auth'
import Colors from '../../../Utils/Themes/Colors'
import FormItem from 'antd/lib/form/FormItem'
import Services from '../../../Services'
import openNotification from '../../../Utils/OpenNotification'
import I18n from '../../../i18n'
import i18n from '../../../i18n'


class ProfileForm extends Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: [],
    passRequired: false,
    disabled: true
  };

  componentDidMount(){
    this.unlockFiels()
  }

  unlockFiels = async () => {
    setTimeout(() => { this.setState({ disabled: false }) }, 300)
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPasswd'], { force: true })
    }
    callback()
  }

  validateToPrevPassword = (rule, value, callback) => {
    const form = this.props.form
    if (value && value !== form.getFieldValue('newPasswd')) {
      callback(i18n.t('user.modal.form.fields.password.rules.noEquals'))
    } else {
      callback()
    }
  }

  handleConfirmBlur = e => {
    const value = e.target.value
    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  handleSubmit = e => {
    const form = this.props.form
    const password = form.getFieldValue('oldPasswd')

    e.preventDefault()

    if (password) {
      this.props.form.validateFields(
        ['oldPasswd', 'newPasswd', 'confirmPasswd'],
        async (err, values) => {
          if (!err) {
            const data = { newPassword : values.confirmPasswd,
                           confirmPassword: values.confirmPasswd,
                           oldPassword: values.oldPasswd
                          }

            let res = await Services.Users.alterPassword(data)
            
            if (res && res.status.success) {
              openNotification(
                'success',
                i18n.t('general.title.success'),
                i18n.t(res.status.message)
              )

              localStorage.clear()
              window.location.href = '/login'
            }
          }
        }
      )
    }

    this.props.form.validateFields(
      ['name', 'phone', 'mail'],
      async (err, values) => {
        if (!err) {
          const user = {
            email: values.mail,
            phone: values.phone,
            name: values.name
          }
          let res = await Services.Users.update(Auth.getUser()._id, user)
          if (res && res.data.nModified) {
            openNotification(
              'success',
              i18n.t('general.title.success'),
              i18n.t(res.status.message)
            )
          }
        }
      }
    )
  }

  onchangePasswd = () => {
    const form = this.props.form
    form.validateFields(['oldPasswd'], (err, values) => {
      if (!err) {
        if (form.getFieldValue('oldPasswd')) {
          this.setState({ passRequired: true })
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
        md: { span: 20 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 24 }
      }
    }
    const formItemDivider = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
        md: { span: 24 }
      }
    }

    return (
      <Form onSubmit={this.handleSubmit} layout="vertical">
        <Row>
          <Form.Item
            label={i18n.t('user.table.columns.name')}
            {...formItemLayout}
          >
            {getFieldDecorator('name', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  pattern: /\S/, // verify that the field contains only whitespaces
                  message: i18n.t('user.modal.form.fields.name.rules.required')
                },
                {
                  pattern: /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/, // verify if is alfabetic
                  message: I18n.t('user.modal.form.fields.name.rules.patternInvalidCharacter')
                },
                {
                  max: 100,
                  message: i18n.t('user.modal.form.fields.name.rules.max')
                },
                {
                  min: 3,
                  message: i18n.t('user.modal.form.fields.name.rules.min')
                }
              ],
              initialValue: Auth.getUser().name || ''
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={i18n.t('user.table.columns.email')}
            {...formItemLayout}
          >
            {getFieldDecorator('mail', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  pattern: /\S/,
                  message: i18n.t('user.modal.form.fields.email.rules.required')
                },
                {
                  pattern: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
                  message: I18n.t('user.errors.emailInvalid')
                },
                {
                  max: 50,
                  message: i18n.t('user.modal.form.fields.email.rules.max')
                }
              ],
              initialValue: Auth.getUser().email || ''
            })(<Input />)}
          </Form.Item>
          <Form.Item
            label={i18n.t('user.table.columns.phone')}
            {...formItemLayout}
          >
            {getFieldDecorator('phone', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: i18n.t(
                    'user.modal.form.fields.phone.rules.required'
                  ),
                  whitespaces: false
                },
                {
                  pattern: /\(\d{2,}\) \d{4,}\s\d{4}/g,
                  message: 'telefone inválido'
                }
              ],
              initialValue: `${Auth.getUser().phone}` || ''
            })(<InputPhone />)}
          </Form.Item>

          <FormItem {...formItemDivider}>
            <Typography.Title
              level={4}
              style={{ color: Colors.DARK_BLUE, fontWeight: 'bold' }}
            >
              {i18n.t('user.labels.alterPassword')}
            </Typography.Title>
            <hr
              style={{
                border: `0.5px solid ${Colors.MID_BLUE}`,
                marginBottom: 3
              }}
            />
          </FormItem>

          <Form.Item
            label={i18n.t('user.table.columns.passwordOld')}
            {...formItemLayout}
          >
            {getFieldDecorator('oldPasswd', {
              validateTrigger: ['onBlur', 'onChange'],
              rules: [
                { max: 20, message: I18n.t('user.modal.form.fields.password.rules.max') },
                { min: 7, message: I18n.t('user.modal.form.fields.password.rules.min') }
              ],
            })(<Input.Password style={{ height: 41 }} onBlur={() => this.onchangePasswd()}
              placeholder="Deixe esse campo vazio caso não queira alterar sua senha." disabled = {this.state.disabled} />)}
          </Form.Item>

          <Form.Item
            label={i18n.t('user.table.columns.passwordNew')}
            {...formItemLayout}
          >
            {getFieldDecorator('newPasswd', {
              validateTrigger: ['onBlur', 'onChange'],
              rules: [
                {
                  required: this.state.passRequired,
                  message: i18n.t(
                    'user.modal.form.fields.password.rules.required'
                  )
                },
                { max: 20, message: I18n.t('user.modal.form.fields.password.rules.max') },
                { min: 7, message: I18n.t('user.modal.form.fields.password.rules.min') },
                { validator: this.validateToNextPassword },
              ],
            })(<Input.Password style={{ height: 41 }}
              placeholder="Deixe esse campo vazio caso não queira alterar sua senha." disabled = {this.state.disabled}/>)}
          </Form.Item>

          <Form.Item
            label={i18n.t('user.table.columns.passwordRepeat')}
            {...formItemLayout}
          >
            {getFieldDecorator('confirmPasswd', {
              validateTrigger: ['onBlur', 'onChange'],
              rules: [
                {
                  required: this.state.passRequired,
                  message: i18n.t(
                    'user.modal.form.fields.password.rules.required'
                  )
                },
                { validator: this.validateToPrevPassword },
                { max: 20, message: I18n.t('user.modal.form.fields.password.rules.max') },
                { min: 7, message: I18n.t('user.modal.form.fields.password.rules.min') }
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} style={{ height: 41 }}
              placeholder="Deixe esse campo vazio caso não queira alterar sua senha." disabled = {this.state.disabled}/>)}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              {I18n.t('button.save')}
            </Button>
          </Form.Item>
        </Row>
      </Form>
    )
  }
}
const WrappedApp = Form.create({ name: 'coordinated' })(ProfileForm)
export default WrappedApp
