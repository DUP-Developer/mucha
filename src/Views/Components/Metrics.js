import React from 'react'
import { Form, Input, Icon, Button, Popconfirm } from 'antd'
import Service from '../../Services'
import Colors from '../../Utils/Themes/Colors'
import OpenNotification from '../../Utils/OpenNotification'
import I18n from '../../i18n'

let id = 0

class Metrics extends React.Component {
  state = {
    data: [],
    item: {},
    showSubmitButton: false
  }

  componentDidMount() {
    if (this.props.list) this.setState({ data: this.props.list })
    if (this.props.item) this.setState({ item: this.props.item })
  }

  remove = async metricKey => {
    const { form } = this.props
    const keys = form.getFieldValue('keys')

    if (keys.length === 1) {
      return
    }

    let response
    // Removendo a métrica do estado
    const newData = this.state.data.filter(metric => metric._id !== metricKey)

    // Removendo logicamente uma nova métrica
    if (metricKey.startsWith('new')) {
      // Removendo do array de chaves antd
      form.setFieldsValue({
        keys: newData
      })
      // Atualizando o estado estado
      this.setState({ data: newData })
      response = {
        status: {
          success: true,
          message: 'item.success.deleteMetric'
        }
      }
    } else {
      // Removendo no banco de dados
      response = await Service.Items.removeMetric(this.props.item.id, metricKey)
      if (response.status.success) {
        // Removendo logicamente uma métrica existente no banco
        this.setState({ data: newData })
        form.setFieldsValue({
          keys: newData
        })
      }
    }
    return response
  }

  add = () => {
    this.props.form.validateFields(async (err, values) => {
      if (err) {
        return
      }

      if (this.state.showSubmitButton !== true) {
        this.setState({ showSubmitButton: true })
      }
      const { form } = this.props
      const keys = form.getFieldValue('keys')
      // Criando objeto padrão utilizado no form de métricas
      const nextKeys = keys.concat({
        _id: `new-${id++}`,
        title: '',
        created: true
      })

      form.setFieldsValue({
        keys: nextKeys
      })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        //Filtrando os dados para enviar novas métricas sem ID
        const dataToSubmit = this.state.data.map(metric => {
          if (metric.new) {
            return {
              title: metric.title
            }
          } else {
            return metric
          }
        })

        const response = await Service.Items.createMetrics(
          this.props.item._id,
          dataToSubmit
        )

        if (response && response.status.success) {
          this.props.form.resetFields()
          this.setState({
            showSubmitButton: false,
            data: response.data.metrics
          })
          OpenNotification('success', I18n.t(response.status.message))
        }
      }
    })
  }

  onChange = value => {
    const { form } = this.props
    const metric = value.currentTarget
    metric._id = metric.id.split('@')[1] // pegando o id da metrica que esta dentro de um padrão do antdesign
    this.state.data.forEach(val => {
      //atualizando valor recebido do input
      if (val._id === metric._id) {
        val.title = metric.value
        return
      }
    })

    // Identificando se o campo que está mudando é uma nova Métrica para poder inseri-lo no state
    if (metric._id.includes('new-')) {
      metric._id = metric._id.split('new-')[1]
      //criando nova métrica no state
      const newMetric = {
        _id: `new${metric._id}`,
        title: metric.value,
        new: true
      }
      this.state.data.push(newMetric)
      form.setFieldsValue({
        keys: this.state.data
      })
      //definindo id para a nova métrica
      value.currentTarget.id = `${metric.id.split('@')[0]}@${newMetric._id}`
    }

    if (this.state.showSubmitButton === false)
      this.setState({ showSubmitButton: true })
  }

  confirm = async metricKey => {
    let response = await this.remove(metricKey)
    if (response.status.success) {
      OpenNotification('success', I18n.t(response.status.message))
    }
  }

  cancel = e => {}

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { showSubmitButton, data } = this.state
    const { item } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    }

    getFieldDecorator('keys', { initialValue: data })
    const keys = getFieldValue('keys')
    const formItems = keys
      .filter(a => (item.active || !a._id.startsWith('new')))
      .map((metric, index) => {        
        return (
          <Form.Item {...formItemLayout} required={false} key={index}>
            {getFieldDecorator(`@${metric._id}`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  pattern: /\S/, // verify that the field contains only whitespaces
                  message: I18n.t('item.tab.form.fields.metrics.rules.required')
                },
                {
                  max: 200,
                  message: I18n.t('item.tab.form.fields.metrics.rules.max')
                }
              ],
              initialValue: `${
                typeof metric.title === 'string' ? metric.title : ''
              }`
            })(
              <Input
                disabled={!item.active}
                placeholder={I18n.t('item.tab.form.fields.metrics.placeholder')}
                onChange={this.onChange}
                style={{ width: '80%', marginRight: 8 }}
              />
            )}
            {keys.length > 1 && item.active ? (
              <Popconfirm
                title={I18n.t('item.modal.confirm.popConfirm')}
                onConfirm={() => this.confirm(metric._id)}
                onCancel={() => this.cancel()}
                okText={I18n.t('button.yes')}
                cancelText={I18n.t('button.no')}
              >
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle"
                  style={{ color: Colors.REMOVE_BUTTON }}
                  theme="filled"
                />
              </Popconfirm>
            ) : null}
          </Form.Item>
        )
      })
    return (
      <Form onSubmit={this.handleSubmit} style={{ marginLeft: 30 }}>
        {data.length === 0 && <p>{I18n.t('item.tab.empty')}</p>}

        {formItems}

        {item.active && (
          <Form.Item {...formItemLayout}>
            <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
              <Icon type="plus" /> {I18n.t('button.register')}
            </Button>
          </Form.Item>
        )}

        <Form.Item {...formItemLayout}>
          {showSubmitButton && item.active ? (
            <Button type="primary" htmlType="submit">
              {I18n.t('button.save')}
            </Button>
          ) : null}
        </Form.Item>
      </Form>
    )
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(
  Metrics
)

export default WrappedDynamicFieldSet
