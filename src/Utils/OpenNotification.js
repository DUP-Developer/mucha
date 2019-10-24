import { notification } from 'antd'

const openNotification = (type, message, description) => {
  notification.destroy()
  notification[type]({
    message,
    description
  })
}

export default openNotification
