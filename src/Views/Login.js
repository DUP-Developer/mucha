import React, { Component } from 'react'
import {
  Layout,
  Form,
  Icon,
  Button,
  Input,
} from 'antd'
import Images from '../Utils/Images'
import Services from "../Services";
import Auth from "../Utils/Auth";
import { Link } from "react-router-dom";
import I18n from "../i18n";
import Colors from '../Utils/Themes/Colors';

const { Content } = Layout

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const result = (await Services.Login.login({ ...values }))

        if (result && result.status.success) {
          Auth.setUser(result.data)
          Auth.setToken(result.token)

          window.location.href = (result.data.newUser) ? '/profile' : '/'
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <Layout style={{ backgroundColor: Colors.GREEN, }}>
        <Content className='content-page-login'>
          <div className='box-content-login' style={{ borderRadius: 50, }}>
            <div className='box-img'>
              <img src={ Images.logo } width="150" alt='' />
            </div>

            <div className='box-form'>
              <Form onSubmit={this.handleSubmit} layout='vertical'>
                <Form.Item label="E-mail: ">
                  {getFieldDecorator('email', {
                    validateTrigger: [ 'onBlur' ],
                    rules: [
                      {
                        required: true,
                        message: 'Informe seu e-mail nesse campo'
                      },
                      {
                        pattern: (/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i),
                        message: 'E-mail com formato inválido'
                      }
                    ]
                  })(
                    <Input
                      prefix={ <Icon type='user'/> }
                      placeholder='Informe seu e-mail'
                      style={{ height: 40 }}
                    />
                  )}
                </Form.Item>

                <Form.Item label="Senha: ">
                  {getFieldDecorator('password', {
                    validateTrigger: [ 'onBlur' ],
                    rules: [
                      {
                        required: true,
                        message: 'Informe sua senha nesse campo'
                      }
                    ]
                  })(
                    <Input.Password
                      prefix={ <Icon type='lock' /> }
                      placeholder='Informe sua senha'
                      style={{ height: 40 }}
                    />
                  )}
                </Form.Item>

                <Form.Item className='box-button-login'>
                  <Button
                    type='primary'
                    htmlType='submit'
                    style={{ width: '100%', height: 40, fontSize: 16 }}
                    icon='login'
                  >
                    {I18n.t('button.login')}
                  </Button>
                </Form.Item>
                <Link
                  className='login-form-forgot'
                  to=''
                  style={{ float: 'right' }}
                >
                  Esqueceu sua senha?
                </Link>
              </Form>
            </div>
          </div>
        </Content>
      </Layout>
    )
  }
}

export default Form.create({ name: 'normal_login' })(Login)
