import React, { Component } from 'react'
import { Form, Input, Select, Upload, Icon, Modal } from 'antd'
import I18n from '../../../i18n'
import openNotification from '../../../Utils/OpenNotification'
import _ from 'lodash'
import imageCompression from 'browser-image-compression';


let formName = null

class FormScreen extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  }

  componentDidMount() {
    formName = this.props.formName

    if (this.props.selectedScreen.image) {
      this.setState({
        fileList: [
          {
            uid: '-1',
            name: 'advansat.png',
            status: 'done',
            url: this.props.selectedScreen.image
          }
        ]
      })
    }
  }

  mountScreenOption = screens =>
    Object.keys(screens).map(screen => {
      return <Select.Option key={screen}>{screens[screen]}</Select.Option>
    })

  getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj)
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    })
  }

  handleChange = async ({ fileList }) => {
    
    let imageBase64 = this.props.selectedScreen.image
    if (!_.isEmpty(fileList) && !_.isEmpty(fileList[0].status)) {
      imageBase64 = fileList.length
        ? await this.getBase64( await this.handleImageUpload(fileList[0].originFileObj))
        : null
      this.setState({ fileList })
    } else {
      imageBase64 = null
      this.setState({ fileList: [] })
    }
    
    this.props.handleBase64(imageBase64)
  }

  handleImageUpload = async file => {
    const imageFile = file;
    const isLt4M = file.size / 1024 / 1024 < 1
    if (!isLt4M) {
      var options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1366,
        useWebWorker: true
      }
      try {
        const compressedFile = await imageCompression(imageFile, options);     
        return compressedFile
      } catch (error) {
        console.log(error);
      }
    }else{
      return file
    }
  }

  beforeUpload = file => {
    const typeFiles = ['image/jpeg', 'image/jpg', 'image/png']
    const isImageValid = typeFiles.includes(file.type)
    if (!isImageValid) {
      openNotification(
        'error',
        I18n.t('mapNavigation.form.upload.rules.invalidFormat')
      )
    }
    return isImageValid
  }

  render() {
    const { form, selectedScreen, screens, screenParent } = this.props
    const { getFieldDecorator } = form
    const { previewVisible, previewImage, fileList } = this.state
    const uploadButton = (
      <div>
        <Icon type="paper-clip" />
        <div className="ant-upload-text">{I18n.t('mapNavigation.form.upload.label')}</div>
      </div>
    )

    return (
      <>
        <Form layout="vertical">
          <Form.Item label={I18n.t('mapNavigation.form.fields.parent.label')}>
            {getFieldDecorator('parent', {
              initialValue: screenParent
            })(<Select>{this.mountScreenOption(screens)}</Select>)}
          </Form.Item>

          <Form.Item label={I18n.t('mapNavigation.form.fields.label.label')}>
            {getFieldDecorator('label', {
              rules: [
                {
                  required: true,
                  message: I18n.t(
                    'mapNavigation.form.fields.label.rules.required'
                  )
                },
                {
                  max: 40,
                  message: I18n.t('mapNavigation.form.fields.label.rules.max')
                }
              ],
              initialValue: selectedScreen.label || ''
            })(<Input />)}
          </Form.Item>

          <Form.Item
            label={I18n.t('mapNavigation.form.fields.description.label')}
          >
            {getFieldDecorator('description', {
              rules: [
                {
                  pattern: /\S/,
                  message: I18n.t(
                    'mapNavigation.form.fields.description.rules.pattern'
                  )
                },
                {
                  max: 500,
                  message: I18n.t(
                    'mapNavigation.form.fields.description.rules.max'
                  )
                }
              ],
              initialValue: selectedScreen.description || ''
            })(<Input.TextArea style={{ resize: 'none' }} rows={4} />)}
          </Form.Item>
        </Form>

        <div className="clearfix">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            beforeUpload={this.beforeUpload}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </div>
      </>
    )
  }
}

export default Form.create({ name: formName })(FormScreen)
