/**
 * 封装 record 相关的 API_URL
 * @type {{deleteRecordById: string, insertRecord: string, updateRecordById: string, getRecordList: string, getRecordById: string}}
 */
const RECORD_API_URL = {
  getRecordList: '/record/list/',
  getRecordById: '/record/id',
  insertRecord: '/record/insert',
  updateRecordById: '/record/id',
  deleteRecordById: '/record/id'
}

export default RECORD_API_URL
