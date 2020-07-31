import axios from 'axios'
import config from './config'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const service = axios.create({
  baseURL: config.baseUrl,
  timeout: 5000
})

const errorOptions = {
  message: '请求失败，请稍后重试',
  type: 'error',
  duration: 2000,
  showClose: true
}

service.interceptors.request.use(config => {
  NProgress.start()

  //  绕过 get 请求
  if (config.method === 'get') {
    config.data = true
  }
  return config
}, error => {
  Message(errorOptions)
  return Promise.reject(error)
})

service.interceptors.response.use(config => {
  NProgress.done()
  return config
})

export default service
