/**
 * 封装 user 相关的 API_URL
 * @type {{getUserById: string, insertUser: string, updateUserById: string, getUserList: string, deleteUserById: string}}
 */
const USER_API_URL = {
  getUserList: '/user/list/',
  getUserById: '/user/id',
  getUserByToken: '/user/token/id',
  insertUser: '/user/register',
  updateUserById: '/user/id',
  deleteUserById: '/user/id',
  login: '/user/admin/login'
}

export default USER_API_URL
