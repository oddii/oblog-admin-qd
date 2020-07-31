<template>
  <div class="type-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getTypeList({
                currentPage: currentPage,
                pageSize: pageSize,
                like:searchValue
              })"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新建分类
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="分类 Id" prop="id" align="center" width="200" />
      <el-table-column label="分类名称" prop="name" align="center">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.name" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类logo" prop="name" align="center" width="200px">
        <template slot-scope="{row}">
          <el-image :src="row.logo" style="width: 180px" />
        </template>
      </el-table-column>
      <el-table-column label="包含博客数" prop="num" align="center" width="120"/>
      <el-table-column label="创建时间" prop="gmtCreate" align="center"  width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center"  width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center" width="300">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditTag($index,row)">编辑</el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-else
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

    <el-dialog title="新建分类" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">
      <el-form>
        <el-form-item label="分类名称：" label-width="130px" required>
          <el-input v-model="insertTypeName"/>
        </el-form-item>
        <el-form-item label="分类logo地址：" label-width="130px" required>
          <el-input v-model="insertTypeLogo"/>
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
import TYPE_API_URL from '../../../api/typeApiUrl'

export default {
  name: 'type-list',
  created () {
    this.getTypeList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    return {
      searchValue: '',
      insertDlgVisible: false, //  新增分类对话框
      insertTypeName: '', //  新增分类的值
      insertTypeLogo: '', //  新增分类的logo地址
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
      this.getTypeList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getTypeList({
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
      this.insertTypeName = ''
    },
    getTypeList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(TYPE_API_URL.getTypeList, params)
        .then(result => {
          console.log(result)
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
    handleInsertTag () {
      /**
       * 新建标签
       */
      if (this.insertTypeName === '') return this.$message.error('分类名称不能为空')

      api.insertObject(TYPE_API_URL.insertType, {
        name: this.insertTypeName,
        logo: this.insertTypeLogo
      })
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)
          this.handleInsertDlgClose()

          this.getTypeList({
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
      /**
       * 取消提交
       */
      this.$set(this.showEdit, index, false)
      row.name = this.beforeEditValue
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */
      if (row.name === '') return this.$message.error('分类名称不能为空')

      const id = row.id
      const name = row.name

      this.$set(this.showEdit, index, false)

      api.updateObjectById(TYPE_API_URL.updateTypeById, id, {
        name
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) { //  如果删除失败
            this.handleSubmitEdit(index, row)
            return this.$message.error(data.msg)
          }

          this.getTypeList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            like: this.searchValue
          })

          return this.$message.success(data.msg)
        })
        .catch(error => {
          this.handleSubmitEdit(index, row)
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
        return this.$message.error('该分类拥有包含博客，请先修改对应博客标签，再进行删除')
      }

      api.deleteObjectById(TYPE_API_URL.deleteTypeById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)

          this.getTypeList({
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
.type-list-wrapper{
  .el-table{
    .btn-item {
      margin: 0 7px;
    }
  }
}
</style>
