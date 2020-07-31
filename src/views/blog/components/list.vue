<template>
  <div class="blog-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getBlogList({
              currentPage: currentPage,
              pageSize: pageSize,
              like: searchValue,
              type:'admin'})"/>
        </el-input>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <!--扩展行-->
      <el-table-column type="expand">
        <template slot-scope="{$index,row}">

          <div class="expand-container">
            <!--标签区域-->
            <div class="tag-container">
              <span class="tag-title">标签：</span>
              <el-tag v-for="(item,index) in row.tag.split(' ')" :key="index" @close="handleCloseTag(row.id,row.tag.split(' '),item)"
                      class="tag-item" closable effect="plain">
                {{item}}
              </el-tag>
              <!--新增标签按钮，最多只能添加5个标签-->
              <el-button size="small" icon="el-icon-plus" @click="handleInsertTagDlgShow(row)"
                         v-if="row.tag.split(' ').length < 5">
                New Tag
              </el-button>
            </div>

            <!--操作按钮区域-->
            <div class="btn-container">
                <el-button type="primary" size="medium" icon="el-icon-edit" @click="handleEditBlog($index,row)"
                           v-if="showEdit[$index] !== true" round>编辑</el-button>
                <el-button type="success" size="medium" icon="el-icon-check" @click="handleSubmitEdit($index,row)"
                           v-if="showEdit[$index] === true" round>提交</el-button>
                <el-button type="info" size="medium" icon="el-icon-close" @click="handleCancelEdit($index,row)"
                         v-if="showEdit[$index] === true" round>取消</el-button>
                <el-button type="warning" size="medium" icon="el-icon-edit-outline" @click="toEdit(row.id)"
                           round>修改</el-button>
                <el-button type="danger" size="medium" icon="el-icon-delete" @click="handleDeleteBlog(row.id)"
                           round>删除</el-button>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="博客ID" prop="id" align="center" width="120"/>

      <el-table-column label="标题" prop="title" align="center">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.title" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="作者" prop="author" align="center" width="120">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.author" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.author}}</span>
        </template>
      </el-table-column>

      <el-table-column label="专栏" prop="flag" align="center" width="80">
        <template slot-scope="scope">
          <el-tag effect="plain"  v-if="scope.row.flag === 0">{{scope.row.flag | formatFlag}}</el-tag>
          <el-tag type="warning" effect="plain" v-else>{{scope.row.flag | formatFlag}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="浏览数" prop="views" align="center" width="80"/>
      <el-table-column label="点赞数" prop="likes" align="center" width="80"/>
      <el-table-column label="分享数" prop="shares" align="center" width="80"/>

      <el-table-column label="分类" prop="type" align="center" width="120">
        <template slot-scope="{$index,row}">
          <el-select v-model="row.type" v-if="showEdit[$index] === true">
            <el-option v-for="item in typeOptions" :key="item.value"
                       :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-tag effect="plain" v-else>{{row.type}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="赞赏功能" prop="appreciation" align="center" width="80">
        <template slot-scope="{row}">
          <el-switch v-model="row.appreciationAble" @change="handleAppreAbleChange(row.id,row.appreciationAble)"
                     :active-value="1" :inactive-value="0" active-color="#a29bfe" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column label="评论功能" prop="commentAble" align="center" width="80">
        <template slot-scope="{row}">
          <el-switch v-model="row.commentAble" @change="handleCommentAbleChange(row.id,row.commentAble)"
                     :active-value="1" :inactive-value="0" active-color="#a29bfe" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column label="版权功能" prop="copyRightAble" align="center" width="80">
        <template slot-scope="{row}">
          <el-switch v-model="row.copyrightAble" @change="handleCopyrightAbleChange(row.id,row.copyrightAble)"
                     :active-value="1" :inactive-value="0" active-color="#a29bfe" inactive-color="#ff4949"/>
        </template>
      </el-table-column>

      <el-table-column label="发布状态" prop="status" align="center" width="110">
        <template slot-scope="{$index,row}">
          <el-select v-model="row.status" v-if="showEdit[$index] === true">
            <el-option v-for="item in statusOptions" :key="item.value"
                       :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-tag :type="formatPublished(row.status).type" v-else>
            {{formatPublished(row.status).title}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="100"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="100"/>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <!--添加标签对话框-->
    <el-dialog title="新增标签" :visible.sync="insertTagDlgVisible" width="23%" :before-close="handleInsertTagDlgClose">
      <span class="edit-item">选择标签：</span>
      <el-select v-model="insertTagValue" filterable placeholder="请选择" size="small" >
        <el-option v-for="item in tagOptions" :key="item.value"
                   :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="handleInsertTagDlgClose" round>取消</el-button>
        <el-button type="primary" @click="handleInsertTag" round>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import BLOG_API_URL from '../../../api/blogApiUrl'
import TYPE_API_URL from '../../../api/typeApiUrl'
import TAG_API_URL from '../../../api/tagApiUrl'

export default {
  name: 'blog-list',
  created () {
    this.getBlogList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
    this.getTypeList()
    this.getTagList()
  },
  data () {
    return {
      searchValue: '', //  搜索框的值
      editBlogId: '', //  被修改的博客的 id，某些方法需要
      insertTagDlgVisible: false, //  新增标签对话框显示与否
      insertTagValue: '', //  新增标签的值
      insertTagValueList: [], //  新建标签列表
      tagOptions: [], //  标签选项
      typeOptions: [], //  分类选项
      statusOptions: [{ label: '未发布', value: 0 }, { label: '已发布', value: 1 }], //  发布状态选项
      beforeEditValue: {}, //  修改之前的值
      showEdit: [],
      tableData: [],
      currentPage: 0,
      pageSize: 0,
      total: 0
    }
  },
  methods: {
    getTypeList (params = {}) {
      /**
       * 获得分类列表h
       */
      api.getObject(TYPE_API_URL.getTypeList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('获取分类列表失败，服务器出现错误，请稍后再试')

          data.data.forEach(item => {
            this.typeOptions.push({
              value: item.name,
              label: item.name
            })
          })
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('获取分类列表失败，服务器出现错误，请稍后再试')
          }
        })
    },
    getTagList (params = {}) {
      /**
       * 获得标签列表
       */
      api.getObject(TAG_API_URL.getTagList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error('获取分类列表失败，服务器出现错误，请稍后再试')

          data.data.forEach(item => {
            this.tagOptions.push({
              value: item.name,
              label: item.name
            })
          })
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('获取标签列表失败，服务器出现错误，请稍后再试')
          }
        })
    },
    handleInsertTagDlgShow (row) {
      /**
       * 展示新增标签对话框
       */
      this.editBlogId = row.id
      this.insertTagValueList = row.tag.split(' ')
      this.insertTagDlgVisible = true
    },
    handleInsertTagDlgClose () {
      /**
       * 新增标签对话框关闭前的事件
       */
      this.editBlogId = ''
      this.insertTagValue = ''
      this.insertTagValueList = []
      this.insertTagDlgVisible = false
    },
    handleInsertTag () {
      /**
       * 新增标签事件
       */
      const isExists = this.insertTagValueList.some(item => {
        return item === this.insertTagValue
      })
      if (isExists) return this.$message.error('请勿重复添加相同的标签')

      this.insertTagValueList.push(this.insertTagValue)
      api.updateObjectById(BLOG_API_URL.updateBlogTagById, this.editBlogId, {
        tag: this.insertTagValueList.join(' ')
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
          this.handleInsertTagDlgClose()
          this.getBlogList({
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
    handleCloseTag (id, list, tag) {
      /**
       * 删除当前标签
       */

      list.splice(list.indexOf(tag), 1)
      api.updateObjectById(BLOG_API_URL.updateBlogTagById, id, {
        tag: list.join(' ')
      })
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
          this.handleInsertTagDlgClose()
          this.getBlogList({
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
    handleSizeChange (newSize) {
      this.pageSize = newSize
      this.getBlogList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getBlogList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    getBlogList (params = {}) {
      /**
       * 获得列表
       */
      api.getObject(BLOG_API_URL.getBlogList, params)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          console.log(data.data.records)
          this.tableData = data.data.records
          this.currentPage = data.data.current
          this.pageSize = data.data.size
          this.total = data.data.total
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('获取博客列表失败，服务器出现错误，请稍后再试')
          }
        })
    },
    toEdit (id) {
      /**
       * 去修改页面
       */
      this.$router.push(`/blog/edit/${id}`)
    },
    handleEditBlog (index, blog) {
      /**
       * 开启博客编辑
       */
      //  先保存编辑前的值
      this.beforeEditValue = JSON.parse(JSON.stringify(blog))
      this.$set(this.showEdit, index, true)
    },
    handleSubmitEdit (index, row) {
      /**
       * 提交编辑
       */

      const blog = {}
      if (row.title !== this.beforeEditValue.title) {
        if (row.title === '') return this.$message.error('博客标题不能为空')
        blog.title = row.title.trim()
      }

      if (row.author !== this.beforeEditValue.author) {
        if (row.author === '') return this.$message.error('博客作者不能为空')
        blog.author = row.author.trim()
      }
      blog.id = row.id
      blog.type = row.type
      blog.status = row.status

      api.updateObjectById(BLOG_API_URL.updateBlogById, blog.id, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 203) {
            this.handleCancelEdit(index, blog)
            return this.$message.error(data.msg)
          }

          this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) {
            this.handleCancelEdit(index, blog)
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })

      this.$set(this.showEdit, index, false)
    },
    handleCancelEdit (index, blog) {
      /**
       * 取消编辑
       */
      blog.title = this.beforeEditValue.title
      blog.author = this.beforeEditValue.author
      blog.type = this.beforeEditValue.type
      blog.status = this.beforeEditValue.status
      this.$set(this.showEdit, index, false)
    },
    handleDeleteBlog (id) {
      api.deleteObjectById(BLOG_API_URL.deleteBlogById, id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)

          this.$message.success(data.msg)
          this.getBlogList({
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
    handleAppreAbleChange (id, appreciationAble) {
      /**
       *  开启/关闭悬赏功能
       */
      const blog = {}
      blog.id = id
      blog.appreciationAble = appreciationAble
      api.updateObjectById(BLOG_API_URL.updateBlogById, blog.id, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    handleCommentAbleChange (id, commentAble) {
      /**
       * 开启/关闭评论功能
       */
      const blog = {}
      blog.id = id
      blog.commentAble = commentAble
      api.updateObjectById(BLOG_API_URL.updateBlogById, blog.id, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    handleCopyrightAbleChange (id, copyrightAble) {
      /**
       * 开启/关闭版权功能
       */
      const blog = {}
      blog.id = id
      blog.copyrightAble = copyrightAble
      api.updateObjectById(BLOG_API_URL.updateBlogById, blog.id, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    formatPublished (value) {
      /**
         * 格式化发布状态
         */
      switch (value) {
        case 0:
          return {
            title: '未发布',
            type: 'warning'
          }
        case 1:
          return {
            title: '已发布',
            type: 'success'
          }
        case 2:
          return {
            title: '已保存',
            type: 'info'
          }
      }
    }
  },
  filters: {
    formatFlag (value) {
      /**
       * 过滤专栏
       */
      if (value === 0) return '原创'
      else return '转载'
    }
  }
}
</script>

<style lang="less" scoped>
  .blog-list-wrapper {

    .expand-container {
      display: flex;
      justify-content: space-between;

      .tag-container {
        .tag-title {
          margin-right: 10px;
          font-weight: 600;
          color: #909399;
        }

        .tag-item {
          margin-right: 15px;
          font-size: 13px;
          font-weight: 600;
        }
      }

    }

  }
</style>
