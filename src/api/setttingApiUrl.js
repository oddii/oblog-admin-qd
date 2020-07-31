/**
 * 封装 setting 相关的 API_URL
 * @type {{getSettingList: string, deleteSettingById: string, insertSetting: string, getSettingById: string, updateSettingById: string}}
 */
const SETTING_API_URL = {
  getSettingList: '/setting/list/',
  getSettingById: '/setting/id',
  insertSetting: '/setting/insert',
  updateSettingById: '/setting/id',
  deleteSettingById: '/setting/id',
  getLatestAnnoList: '/setting/latest/anno'
}

export default SETTING_API_URL
