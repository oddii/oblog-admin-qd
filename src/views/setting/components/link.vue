<template>
  <div class="link-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getLinkList({
                currentPage:currentPage,
                pageSize,pageSize,
                like:searchValue})"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新增友链
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="友链 Id" prop="id" align="center" width="200" />

      <el-table-column label="描述" prop="description" align="center">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.description" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.description}}</span>
        </template>
      </el-table-column>

      <el-table-column label="友链地址" prop="url" align="center" width="300" >
        <template slot-scope="{row,$index}">
          <el-input v-model="row.url" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column label="logo" prop="picture" align="center" width="100">
        <template slot-scope="{row}">
          <el-avatar :src="row.logo" icon="el-icon-user-solid" :size="50" shape="square"/>
<!--          <img :src="row.logo" alt="" style="width: 50px;">-->
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170" />
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center"  width="330">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditLink($index,row)">编辑</el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleSubmitEdit($index,row)">提交</el-button>
          <el-button type="info" size="medium" icon="el-icon-close" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleCancelEdit($index,row)">取消</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete"
                     round class="btn-item" @click="handleDeleteLink(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <el-dialog title="新建友链" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">
      <el-form :rules="insertRules" :model="insertValue" ref="insertLinkRef">
        <el-form-item label="友链描述：" label-width="130px" prop="description">
          <el-input v-model="insertValue.description" />
        </el-form-item>
        <el-form-item label="友链logo地址：" label-width="130px" prop="logo">
          <el-input v-model="insertValue.logo"/>
        </el-form-item>
        <el-form-item label="友链地址：" label-width="130px" prop="url">
          <el-input v-model="insertValue.url"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleInsertDlgClose" round>取 消</el-button>
        <el-button type="primary" @click="handleInsertLink" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import LINK_API_URL from '../../../api/linkApiUrl'

export default {
  name: 'link-list',
  created () {
    this.getLinkList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    return {
      searchValue: '', //  搜索框的值
      insertDlgVisible: false, //  新增友链对话框
      insertValue: {
        description: '',
        url: '',
        logo: ''
      }, //  新增友链的值
      insertRules: {
        description: [{ required: true, message: '请输入友链描述', trigger: 'blur' }],
        url: [{ required: true, message: '请输入友链地址', trigger: 'blur' }],
        logo: [{ required: true, message: '请输入友链logo地址', trigger: 'blur' }]
      }, //  新增友链时的验证
      beforeEditValue: '', //  修改之前的值
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
      this.getLinkList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getLinkList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleInsertDlgClose () {
      /**
       * 关闭新增友链对话框
       */
      this.insertDlgVisible = false
      this.insertValue = {
        description: '',
        url: '',
        logo: ''
      }
    },
    getLinkList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(LINK_API_URL.getLinkList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          this.tableData = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
          console.log(this.tableData)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleInsertLink () {
      /**
       * 新建标签
       */
      this.$refs.insertLinkRef.validate((valid) => {
        if (valid) {
          const link = this.insertValue

          api.insertObject(LINK_API_URL.insertLink, link)
            .then(result => {
              const { data } = result
              if (data.code !== 201) return this.$message.error(data.msg)
              this.handleInsertDlgClose()
              this.$message.success(data.msg)

              return this.getLinkList({
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
    handleEditLink (index, row) {
      /**
       * 开启编辑
       */
      this.beforeEditValue = {
        description: row.description,
        url: row.url
      }
      this.$set(this.showEdit, index, true)
    },
    handleCancelEdit (index, row) {
      /**
       * 取消编辑
       */
      this.$set(this.showEdit, index, false)
      row.description = this.beforeEditValue.description
      row.url = this.beforeEditValue.url
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */
      const id = row.id
      const link = {}

      //  判断 description 是否和修改前的一致
      if (row.description !== this.beforeEditValue.description) {
        if (row.description === '') return this.$message.error('友链描述不能为空')
        link.description = row.description
      }

      //  判断 url 是否和修改前的一致
      if (row.url !== this.beforeEditValue.url) {
        if (row.url === '') return this.$message.error('友链地址不能为空')
        link.url = row.url
      }

      this.$set(this.showEdit, index, false)

      api.updateObjectById(LINK_API_URL.updateLinkById, id, link)
        .then(result => {
          const { data } = result
          if (data.code !== 203) { //  如果更新失败
            this.handleCancelEdit(index, row)
            return this.$message.error(data.msg)
          }

          this.$message.success(data.msg)

          this.getLinkList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })
        })
        .catch(error => { //  如果更新失败
          this.handleCancelEdit(index, row)
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleDeleteLink (row) {
      /**
       * 删除友链
       */
      api.deleteObjectById(LINK_API_URL.deleteLinkById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)
          this.$message.success(data.msg)

          return this.getLinkList({
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
  }
}
</script>

<style lang="less" scoped>
.link-list-wrapper{
  .el-table {
    .btn-item {
      margin: 0 7px;
    }
  }
}
</style>
