<template>
  <div class="tag-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getTagList({
                currentPage: currentPage,
                pageSize: pageSize,
                like:searchValue
              })"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新建标签
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="标签 Id" prop="id" align="center" width="200" />
      <el-table-column label="标签名称" prop="name" align="center" width="450">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.name" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="包含博客数" prop="num" align="center"/>
      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center" width="330">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditTag($index,row)">编辑</el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleSubmitEdit($index,row)">提交</el-button>
          <el-button type="info" size="medium" icon="el-icon-close" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleCancelEdit($index,row)">取消</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete"
                     round class="btn-item" @click="handleDeleteTag(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <el-dialog title="新增标签" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">
      <el-form>
        <el-form-item label="标签名称：" label-width="100px" required>
          <el-input v-model="insertValue"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="handleInsertDlgClose" round>取 消</el-button>
        <el-button type="primary" @click="handleInsertTag" round>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import TAG_API_URL from '../../../api/tagApiUrl'

export default {
  name: 'tag-list',
  created () {
    this.getTagList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    return {
      searchValue: '', // 模糊搜索的条件
      insertDlgVisible: false, //  新增标签对话框
      insertValue: '', //  新增标签的值
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
      this.getTagList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getTagList({
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
    getTagList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(TAG_API_URL.getTagList, params)
        .then(result => {
          console.log(result)
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
    handleInsertTag () {
      /**
       * 新建标签
       */
      if (this.insertValue === '') return this.$message.error('标签名称不能为空')

      api.insertObject(TAG_API_URL.insertTag, {
        name: this.insertValue
      })
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)
          this.handleInsertDlgClose()

          this.getTagList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })

          return this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleEditTag (index, row) {
      /**
       * 开启编辑
       */
      this.beforeEditValue = row.name
      this.$set(this.showEdit, index, true)
    },
    handleCancelEdit (index, row) {
      this.$set(this.showEdit, index, false)
      row.name = this.beforeEditValue
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */
      if (row.name === '') return this.$message.error('标签名称不能为空')

      const id = row.id
      const name = row.name

      this.$set(this.showEdit, index, false)

      api.updateObjectById(TAG_API_URL.updateTagById, id, {
        name
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) { //  如果删除失败
            this.handleCancelEdit(index, row)
            return this.$message.error(data.msg)
          }

          this.getTagList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })

          return this.$message.success(data.msg)
        })
        .catch(error => {
          this.handleCancelEdit(index, row)
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleDeleteTag (row) {
      /**
       * 删除标签
       */
      if (row.num > 0) {
        return this.$message.error('该标签拥有包含博客，请先修改对应博客标签，再进行删除')
      }

      api.deleteObjectById(TAG_API_URL.deleteTagById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)

          this.getTagList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })

          return this.$message.success(data.msg)
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
.tag-list-wrapper{
  .el-table{
    .btn-item {
      margin: 0 7px;
    }
  }
}
</style>
