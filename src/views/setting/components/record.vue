<template>
  <div class="record-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getRecordList({
              currentPage:currentPage,
              pageSize:pageSize,
              like:searchValue})"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新增记录
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="记录 Id" prop="id" align="center" width="200" />
      <el-table-column label="内容" prop="content" align="center">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.content" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center"  width="330">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditRecord($index,row)">编辑</el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleSubmitEdit($index,row)">提交</el-button>
          <el-button type="info" size="medium" icon="el-icon-close" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleCancelEdit($index,row)">取消</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete"
                     round class="btn-item" @click="handleDeleteRecord(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <el-dialog title="新建记录" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">
      <el-form>
        <el-form-item label="内容：" label-width="100px" required>
          <el-input v-model="insertValue" type="textarea" rows="6" resize="none" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleInsertDlgClose" round>取 消</el-button>
        <el-button type="primary" @click="handleInsertRecord" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import RECORD_API_URL from '../../../api/recordApiUrl'

export default {
  name: 'record-list',
  created () {
    this.getRecordList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    return {
      searchValue: '', //  搜索框的值
      insertDlgVisible: false, //  新增友链对话框
      insertValue: '', //  新增友链的值
      insertRules: {
        description: [{ required: true, message: '请输入友链描述', trigger: 'blur' }],
        url: [{ required: true, message: '请输入友链地址', trigger: 'blur' }]
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
      this.getRecordList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getRecordList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleInsertDlgClose () {
      /**
       * 关闭新增标签对话框
       */
      this.insertDlgVisible = false
      this.insertValue = ''
    },
    getRecordList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(RECORD_API_URL.getRecordList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          console.log(data)
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
    handleInsertRecord () {
      /**
       * 新建标签
       */
      if (this.insertValue === '') return this.$message.error('记录内容不能为空')

      const content = this.insertValue

      api.insertObject(RECORD_API_URL.insertRecord, {
        content
      })
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)
          this.handleInsertDlgClose()
          this.$message.success(data.msg)

          return this.getRecordList({
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
    },
    handleEditRecord (index, row) {
      /**
       * 开启编辑
       */
      this.beforeEditValue = row.content
      this.$set(this.showEdit, index, true)
    },
    handleCancelEdit (index, row) {
      /**
       * 取消编辑
       */
      row.content = this.beforeEditValue
      this.$set(this.showEdit, index, false)
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */
      if (row.content === '') return this.$message.error('记录内容不能为空')

      const id = row.id
      const content = row.content

      this.$set(this.showEdit, index, false)

      api.updateObjectById(RECORD_API_URL.updateRecordById, id, {
        content
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) { //  如果更新失败
            this.handleCancelEdit(index, row)
            return this.$message.error(data.msg)
          }

          this.$message.success(data.msg)

          this.getRecordList({
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
    handleDeleteRecord (row) {
      /**
       * 删除标签
       */
      api.deleteObjectById(RECORD_API_URL.deleteRecordById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)
          this.$message.success(data.msg)

          return this.getRecordList({
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
.record-list-wrapper{
  .el-table {
    .btn-item {
      margin: 0 7px;
    }
  }
}
</style>
