/**
 * 封装 link 相关的 API_URL
 * @type {{insertLink: string, getLinkById: string, updateLinkById: string, getLinkList: string, deleteLinkById: string}}
 */

const LINK_API_URL = {
  getLinkList: '/link/list/',
  getLinkById: '/link/id',
  insertLink: '/link/insert',
  updateLinkById: '/link/id',
  deleteLinkById: '/link/id'
}

export default LINK_API_URL
