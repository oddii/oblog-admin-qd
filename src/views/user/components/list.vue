<template>
  <div class="user-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getUserList({
              currentPage:currentPage,
              pageSize:pageSize,
              like:searchValue })"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新增用户
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="用户 Id" prop="id" align="center" width="200"/>

      <el-table-column label="用户昵称" prop="nickname" align="center" width="215">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.nickname" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.nickname}}</span>
        </template>
      </el-table-column>

      <el-table-column label="邮箱地址" prop="email" align="center" width="230">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.email" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column label="头像" prop="picture" align="center" width="85">
        <template slot-scope="{row}">
          <el-avatar :src="row.avatar" icon="el-icon-user-solid" :size="50" shape="square"/>
        </template>
      </el-table-column>

      <el-table-column label="权限" prop="role" align="center">
        <template slot-scope="{row,$index}">
          <el-select v-model="row.role" v-if="showEdit[$index] === true">
            <el-option v-for="item in roleOptions" :key="item.value"
                       :label="item.label" :value="item.value"/>
          </el-select>
          <span v-else>{{row.role | formatRole}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center" width="330">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditUser($index,row)">编辑</el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleSubmitEdit($index,row)">提交</el-button>
          <el-button type="info" size="medium" icon="el-icon-close" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleCancelEdit($index,row)">取消</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete"
                     round class="btn-item" @click="handleDeleteUser(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <el-dialog title="新建用户" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">
      <el-form :rules="insertRules" :model="insertValue" ref="insertUserRef" status-icon>
        <el-form-item label="用户昵称：" label-width="100px" prop="nickname">
          <el-input v-model="insertValue.nickname" />
        </el-form-item>
        <el-form-item label="邮箱地址：" label-width="100px" prop="email" required >
          <el-input v-model="insertValue.email"/>
        </el-form-item>
        <el-form-item label="用户密码：" label-width="100px" prop="password">
          <el-input v-model="insertValue.password" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码：" label-width="100px" prop="confirmPassword">
          <el-input v-model="insertValue.confirmPassword" type="password"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleInsertDlgClose" round>取 消</el-button>
        <el-button type="primary" @click="handleInsertUser" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import api from '../../../api/baseApi'
import USER_API_URL from '../../../api/userApiUrl'

export default {
  name: 'user-list',
  created () {
    this.getUserList({
      currentPage: 1,
      pageSize: 10
    })
  },
  data () {
    const validEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱地址'))
      } else if (!this.pattern.test(value)) {
        callback(new Error('请输入合法的邮箱地址'))
      } else {
        callback()
      }
    }
    return {
      searchValue: '', //  搜索框的值
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //  邮箱正则表达式
      roleOptions: [{ value: 0, label: '普通用户' }, { value: 1, label: '超级管理员' }], //  权限列表
      insertDlgVisible: false, //  新增友链对话框
      insertValue: {
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
      }, //  新增用户的值
      insertRules: {
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }],
        email: [{ validator: validEmail, trigger: 'blur' }],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }]
      }, //  新增友链时的验证
      beforeEditValue: {}, //  修改之前的值
      showEdit: [],
      tableData: [],
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.getUserList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getUserList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleInsertDlgClose () {
      /**
       * 关闭新增用户对话框
       */
      this.insertDlgVisible = false
      this.insertValue = {
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    },
    getUserList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(USER_API_URL.getUserList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.tableData = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleInsertUser () {
      /**
       * 新建用户
       */
      this.$refs.insertUserRef.validate((valid) => {
        if (valid) {
          if (this.insertValue.password !==
              this.insertValue.confirmPassword) return this.$message.error('两次密码输入不一致，请重新输入')

          const user = {
            nickname: this.insertValue.nickname,
            email: this.insertValue.email,
            password: this.insertValue.password
          }

          api.insertObject(USER_API_URL.insertUser, user)
            .then(result => {
              const { data } = result
              if (data.code !== 201) return this.$message.error(data.msg)

              this.$message.success(data.msg)
              this.handleInsertDlgClose()
              this.getUserList({
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                like: this.searchValue
              })
            })
            .catch(error => {
              if (error.response) {
                return this.$message.error('服务器出现错误，请稍后再试')
              }
            })
        } else {
          return this.$message.error('请输入合法的值')
        }
      })
    },
    handleEditUser (index, row) {
      /**
       * 开启编辑
       */
      this.$set(this.showEdit, index, true)
      this.beforeEditValue = {
        nickname: row.nickname,
        email: row.email,
        avatar: row.avatar,
        role: row.role
      }
    },
    handleCancelEdit (index, row) {
      /**
       * 取消编辑
       */
      this.$set(this.showEdit, index, false)
      row.nickname = this.beforeEditValue.nickname
      row.email = this.beforeEditValue.email
      row.role = this.beforeEditValue.role
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */
      const id = row.id
      const user = {}
      if (row.nickname !== this.beforeEditValue.nickname) {
        if (row.nickname === '') return this.$message.error('用户昵称不能为空')
        user.nickname = row.nickname.trim()
      }

      if (row.email !== this.beforeEditValue.email) {
        if (row.email === '') {
          return this.$message.error('邮箱地址不能为空')
        } else if (!this.pattern.test(row.email)) {
          return this.$message.error('请填写合法的邮箱地址')
        }
        user.email = row.email.trim()
      }

      if (row.role !== this.beforeEditValue.role) {
        user.role = row.role
      }

      this.$set(this.showEdit, index, false)

      if (user !== null) {
        api.updateObjectById(USER_API_URL.updateUserById, id, user)
          .then(result => {
            const { data } = result
            if (data.code !== 203) {
              this.handleCancelEdit(index, row)
              return this.$message.error(data.msg)
            }

            this.$message.success(data.msg)

            this.getUserList({
              currentPage: this.currentPage,
              pageSize: this.pageSize,
              like: this.searchValue
            })
          })
          .catch(error => {
            this.handleCancelEdit(index, row)
            if (error.response) {
              return this.$message.error('服务器出现错误，请稍后再试')
            }
          })
      }
    },
    handleDeleteUser (row) {
      /**
       * 删除用户
       */
      api.deleteObjectById(USER_API_URL.deleteUserById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)
          this.$message.success(data.msg)

          return this.getUserList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    }
  },
  filters: {
    formatRole (value) {
      /**
       * 格式化用户权限
       */
      if (value === 0) return '普通用户'
      else return '超级管理员'
    }
  }
}
</script>

<style lang="less" scoped>
  .user-list-wrapper {
    .el-table {
      .btn-item {
        margin: 0 7px;
      }
    }
  }
</style>
