/**
 * 封装 message 相关的 API_URL
 * @type {{insertMessage: string, getMessageList: string, deleteMessageById: string}}
 */
const MESSAGE_API_URL = {
  getMessageList: '/message/list/',
  insertMessage: '/message/insert',
  deleteMessageById: '/message/id',
  selectNum: '/message/num',
  getLatestMessageList: '/message/latest'
}

export default MESSAGE_API_URL
