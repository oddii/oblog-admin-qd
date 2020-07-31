import service from './service'
import config from './config'
import qs from 'qs'

const apiMethods = {
  sendRequest (params) {
    const requestConfig = { headers: {} }
    let data

    //  配置请求的内容格式
    if (params.ctxType === 'formdata') Object.assign(requestConfig, config.ctxFormDataHeader)
    else if (params.ctxType === 'multipart') Object.assign(requestConfig, config.ctxMultipartHeader)
    else Object.assign(requestConfig, config.ctxJsonHeader)

    if (params.params && !params.data) {
      //  将参数传进 axios 实例
      if (params.ctxType === 'formdata') requestConfig.params = qs.stringify(requestConfig.params)
      else requestConfig.params = params.params
    }

    if (!params.params && params.data) {
      if (params.ctxType === 'formdata') data = qs.stringify(params.data)
      else data = params.data
    }

    switch (params.method) {
      case 'get':
        return new Promise((resolve, reject) => {
          service.get(params.url, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
      case 'post':
        return new Promise((resolve, reject) => {
          service.post(params.url, data, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
      case 'put':
        return new Promise((resolve, reject) => {
          service.put(params.url, data, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
      case 'delete':
        return new Promise((resolve, reject) => {
          service.delete(params.url, requestConfig)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
    }
  }
}

export default apiMethods
