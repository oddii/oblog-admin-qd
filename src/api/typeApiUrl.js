/**
 * 封装 type 相关的 API_URL
 * @author odd
 * @type {{getTypeById: string, updateTypeById: string, insertType: string, getTypeList: string, deleteTypeById: string}}
 */

const TYPE_API_URL = {
  getTypeList: '/type/list/',
  getTypeById: '/type/id',
  insertType: '/type/insert',
  updateTypeById: '/type/id',
  deleteTypeById: '/type/id',
  getTop10TypeList: '/type/top10'
}

export default TYPE_API_URL
