import axios from 'axios'
import { HTTP } from '../Utils/Constants'
import { notification } from 'antd'
import I18n from '../i18n'
import Auth from '../Utils/Auth'

const api = axios.create({
  baseURL: `http://${process.env.REACT_APP_HOST}:${
    process.env.REACT_APP_PORT
  }/api/v1`
})

api.interceptors.request.use(async config => {
  if (Auth.getToken()) {
    config.headers.Authorization = `Bearer ${Auth.getToken()}`
  }

  return config
})

api.interceptors.response.use(
  res => {
    if (res.status === HTTP.OK) {
      if (res.data.status.success) {
        return res.data
      } else {
        notification.destroy()
        notification.error({
          message: I18n.t(res.data.status.message)
        })

        return null
      }
    }

    return null
  },
  error => {
    if (!error.response) {
      notification.destroy()
      notification.error({
        message: I18n.t('general.error.apiConnection')
      })
      localStorage.clear()

      return { 
        data: [], 
        status: {
          success: false,
          message: 'general.error.apiConnection'
        } 
      }
    }

    if (error.response.status === HTTP.UNAUTHORIZED) {
      localStorage.clear()
      window.location.href = '/login'
      return null
    }

    notification.destroy()
    notification.error({
      message: I18n.t('general.error.apiConnection')
    })

    return Promise.reject(error)
  }
)

export default api
