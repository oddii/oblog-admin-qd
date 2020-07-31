import apiMethods from '../utils/apiMethods'

/**
 * @author odd
 *  这里封装基础的增删改查方法
 */

const api = {
  /**
   * 获取列表
   * @param url
   * @param params
   * @returns {Promise<unknown>}
   */
  getObject (url, params = {}) {
    // if (params.currentPage && params.pageSize) {
    //   return apiMethods.sendRequest({
    //     url: url + params.currentPage + '/' + params.pageSize,
    //     method: 'get',
    //     params
    //   })
    // } else {
    //   return apiMethods.sendRequest({
    //     url: url + '0/0',
    //     method: 'get',
    //     params
    //   })
    // }
    return apiMethods.sendRequest({
      url: url,
      method: 'get',
      params
    })
  },
  /**
   * 根据 id 获得对象
   * @param url
   * @param id
   * @returns {Promise<unknown>}
   */
  getObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'get'
    })
  },
  /**
   * 新建对象
   * @param url
   * @param data
   * @returns {Promise<unknown>}
   */
  insertObject (url, data = {}) {
    return apiMethods.sendRequest({
      url,
      method: 'post',
      ctxType: 'formdata',
      data
    })
  },
  /**
   * 根据对象 id 更新对象
   * @param url
   * @param id
   * @param data
   * @returns {Promise<unknown>}
   */
  updateObjectById (url, id, data = {}) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'put',
      ctxType: 'formdata',
      data
    })
  },
  /**
   * 根据对象 id 删除对象
   * @param url
   * @param id
   * @returns {Promise<unknown>}
   */
  deleteObjectById (url, id) {
    return apiMethods.sendRequest({
      url: url.replace(/id/, id),
      method: 'delete'
    })
  },
  uploadObject (url, data = {}) {
    return apiMethods.sendRequest({
      url,
      method: 'post',
      ctxType: 'multipart',
      data
    })
  }
}

export default api
