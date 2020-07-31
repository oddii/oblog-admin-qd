<template>
  <div class="message-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getMessageList({
                currentPage:currentPage,
                pageSize:pageSize,
                like:searchValue
              })"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新增留言
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="留言用户" prop="nickname" align="center" width="215"/>
      <el-table-column label="引用留言" prop="replyContent" align="center" />
      <el-table-column label="内容" prop="content" align="center" />
      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center"  width="150">
        <template slot-scope="{row}">
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="handleDeleteMessage(row.id)"
                     round class="btn-item">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import MESSAGE_API_URL from '../../../api/messageApiUrl'

export default {
  name: 'message-list',
  created () {
    this.getMessageList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    return {
      searchValue: '', //  模糊搜索的值
      tableData: [],
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.getMessageList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getMessageList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    getMessageList (params = {}) {
      /**
       * 获取列表
       */
      api.getObject(MESSAGE_API_URL.getMessageList, params)
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
    handleDeleteMessage (id) {
      /**
       * 删除评论
       */
      api.deleteObjectById(MESSAGE_API_URL.deleteMessageById, id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)
          this.$message.success(data.msg)

          return this.getMessageList({
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

<style scoped>

</style>
