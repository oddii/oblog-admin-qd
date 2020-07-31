/**
 * 封装 comment 相关的 API_URL
 * @type {{getCommentList: string, deleteCommentById: string, insertComment: string}}
 */
const COMMENT_API_URL = {
  getCommentList: '/comment/list/',
  insertComment: '/comment/insert',
  deleteCommentById: '/comment/id',
  getLatestCommentList: '/comment/latest'
}

export default COMMENT_API_URL
