/**
 * 封装 tag 相关的 API_URL
 * @type {{insertTag: string, getTagList: string, getTagById: string, updateTagById: string, deleteTagById: string}}
 */

const TAG_API_URL = {
  getTagList: '/tag/list/',
  getTagById: '/tag/id',
  insertTag: '/tag/insert',
  updateTagById: '/tag/id',
  deleteTagById: '/tag/id'
}

export default TAG_API_URL
