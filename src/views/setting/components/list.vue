<template>
  <div class="setting-list-wrapper">
    <div class="table-bar-wrapper">
      <!--搜索区域-->
      <div class="search-wrapper">
        <el-input class="search-input" size="medium" placeholder="请输入内容" v-model="searchValue">
          <el-button slot="append" icon="el-icon-search" @click="getSettingList({
              currentPage: currentPage,
              pageSize: pageSize,
              like: searchValue })"/>
        </el-input>
      </div>

      <!--新增区域-->
      <div class="insert-wrapper">
        <el-button size="medium" icon="el-icon-plus" type="primary" @click="insertDlgVisible = true">
          新增设置 / 公告
        </el-button>
      </div>

      <!--上传图片返回路径区域-->
      <div class="upload-wrapper">
        <el-button size="medium" icon="el-icon-upload" type="primary" @click="uploadDlgVisible = true">
          上传图片
        </el-button>
      </div>
    </div>

    <el-table :data="tableData" style="width: 100%" stripe border>
      <el-table-column type="index" align="center" label="#"/>
      <el-table-column label="设置 / 公告 Id" prop="id" align="center" width="200"/>

      <el-table-column label="标识码" prop="code" align="center" width="100">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.code" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column label="标题" prop="title" align="center" width="150">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.title" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="内容" prop="content" align="center">
        <template slot-scope="{row,$index}">
          <el-input v-model="row.content" v-if="showEdit[$index] === true"/>
          <span v-else>{{row.content}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" prop="gmtCreate" align="center" width="170"/>
      <el-table-column label="更新时间" prop="gmtModified" align="center" width="170"/>

      <!--操作区域-->
      <el-table-column label="操作" prop="gmtModified" align="center" width="330">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="medium" icon="el-icon-edit" v-if="showEdit[$index] !== true"
                     round class="btn-item" @click="handleEditSetting($index,row)">编辑
          </el-button>
          <el-button type="success" size="medium" icon="el-icon-check" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleSubmitEdit($index,row)">提交
          </el-button>
          <el-button type="info" size="medium" icon="el-icon-close" v-if="showEdit[$index] === true"
                     round class="btn-item" @click="handleCancelEdit($index,row)">取消
          </el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete"
                     round class="btn-item" @click="handleDeleteSetting(row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
    </el-pagination>

    <el-dialog title="新建设置 / 公告" :visible.sync="insertDlgVisible"
               width="30%" :before-close="handleInsertDlgClose">

      <el-form :rules="insertRules" :model="insertValue" ref="insertSettingRef">
        <el-form-item label="新建类型：" label-width="140px">
          <el-switch v-model="typeValue" active-text="公告" inactive-text="设置" @change="handleTypeChange"/>
        </el-form-item>
        <el-form-item label="设置 / 公告标识码：" label-width="140px" prop="code">
          <el-input v-model="insertValue.code" id="settingCodeInput"/>
        </el-form-item>
        <el-form-item label="设置 / 公告标题：" label-width="140px" prop="title">
          <el-input v-model="insertValue.title"/>
        </el-form-item>
        <el-form-item label="设置 / 公告内容：" label-width="140px" prop="content">
          <el-input v-model="insertValue.content"/>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="handleInsertDlgClose" round>取 消</el-button>
        <el-button type="primary" @click="handleInsertSetting" round>确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="上传图片" :visible.sync="uploadDlgVisible"
               width="25%" :before-close="handleUploadDlgClose">

      <el-upload class="avatar-uploader" :action="uploadAction" :show-file-list="false"
                 :on-success="handleUploadSuccess" :before-upload="beforeUploadUpload">
        <img v-if="uploadedImageUrl" :src="uploadedImageUrl" class="avatar"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"/>

        <div class="el-upload__tip" slot="tip">
          <div>只能上传jpg/png文件，且不超过500kb</div>
          <div class="uploaded-url">图片url：
            <a style="text-decoration: solid;color: #409EFF;font-size: 14px"
               target="_blank" :href="uploadedImageUrl">{{uploadedImageUrl}}</a>
          </div>
        </div>
      </el-upload>

      <span slot="footer">
        <el-button @click="handleUploadDlgClose" round>关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../api/baseApi'
import SETTING_API_URL from '../../../api/setttingApiUrl'
import judgeUtils from '../../../utils/JudgeUtils'
import config from '../../../utils/config'
import COMMON_API_URL from '../../../api/commonApiUrl'

export default {
  name: 'setting-list',
  created () {
    this.getSettingList({
      currentPage: 1,
      pageSize: 10,
      like: this.searchValue
    })
  },
  data () {
    const codeValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入设置 / 公告标识码'))
      } else if (!judgeUtils.isInteger(value)) {
        callback(new Error('设置 / 公告标识码请输入整数'))
      } else {
        callback()
      }
    }
    return {
      /**
         * baseUploadedUrl: 'http://q83ldkg6r.bkt.clouddn.com/', //  上传成功后 url 基础域名
         *  uploadAction: 'https://upload-z2.qiniup.com/', //  上传地址
         * uploadData: {
         * token: '', //  上传七牛云需要的 token
         * key: '' //  上传 key 值，一般用于当作上传后的文件名
         * }, //  上传时附带的额外参数
         */
      uploadAction: config.baseUrl + COMMON_API_URL.uploadImage2AliyunOSS,
      uploadedImageUrl: '', //  上传成功后的图片 url
      uploadDlgVisible: false, //  上传图片对话框
      searchValue: '', //  模糊查询条件
      typeValue: false, //  新建类型
      insertDlgVisible: false, //  新增友链对话框
      insertValue: {
        code: '',
        title: '',
        content: ''
      }, //  新增友链的值
      insertRules: {
        code: [{
          validator: codeValidate,
          trigger: 'blur'
        }],
        title: [{
          required: true,
          message: '请输入设置 / 公告标题',
          trigger: 'blur'
        }],
        content: [{
          required: true,
          message: '请输入设置 / 公告内容',
          trigger: 'blur'
        }]
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
      this.getSettingList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleCurrentChange (newCur) {
      this.currentPage = newCur
      this.getSettingList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        like: this.searchValue
      })
    },
    handleInsertDlgClose () {
      /**
         * 关闭新增友链对话框
         */
      const settingCodeInput = document.querySelector('#settingCodeInput')
      settingCodeInput.disabled = false
      this.insertDlgVisible = false
      this.typeValue = false
      this.insertValue = {
        code: '',
        title: '',
        content: ''
      }
    },
    getSettingList (params = {}) {
      /**
         * 获取列表
         */
      api.getObject(SETTING_API_URL.getSettingList, params)
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
    handleInsertSetting () {
      /**
         * 新建标签
         */
      this.$refs.insertSettingRef.validate((valid) => {
        if (valid) {
          const setting = this.insertValue

          api.insertObject(SETTING_API_URL.insertSetting, setting)
            .then(result => {
              const { data } = result
              if (data.code !== 201) return this.$message.error(data.msg)
              this.handleInsertDlgClose()
              this.$message.success(data.msg)

              return this.getSettingList({
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
    handleEditSetting (index, row) {
      /**
         * 开启编辑
         */
      this.beforeEditValue = {
        code: row.code,
        title: row.title,
        content: row.content
      }
      this.$set(this.showEdit, index, true)
    },
    handleCancelEdit (index, row) {
      /**
         * 取消编辑
         */
      this.$set(this.showEdit, index, false)
      row.code = this.beforeEditValue.code
      row.title = this.beforeEditValue.title
      row.content = this.beforeEditValue.content
    },
    handleSubmitEdit (index, row) {
      /**
         * 提交编辑
         */
      const id = row.id
      const setting = {}

      //  判断 code 是否和修改前的一致
      if (row.code !== this.beforeEditValue.code) {
        if (row.code === '') return this.$message.error('设置 / 公告标识码不能为空')
        setting.code = row.code
      }

      //  判断 title 是否和修改前的一致
      if (row.title !== this.beforeEditValue.title) {
        if (row.title === '') return this.$message.error('设置 / 公告标题不能为空')
        setting.title = row.title
      }

      //  判断 content 是否和修改前的一致
      if (row.content !== this.beforeEditValue.content) {
        if (row.content === '') return this.$message.error('设置 / 公告内容不能为空')
        setting.content = row.content
      }

      this.$set(this.showEdit, index, false)

      api.updateObjectById(SETTING_API_URL.updateSettingById, id, setting)
        .then(result => {
          const { data } = result
          if (data.code !== 203) { //  如果更新失败
            this.handleCancelEdit(index, row)
            return this.$message.error(data.msg)
          }

          this.$message.success(data.msg)

          this.getSettingList({
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
    handleDeleteSetting (row) {
      /**
         * 删除友链
         */
      api.deleteObjectById(SETTING_API_URL.deleteSettingById, row.id)
        .then(result => {
          const { data } = result
          if (data.code !== 204) return this.$message.error(data.msg)
          this.$message.success(data.msg)

          return this.getSettingList({
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
    handleTypeChange () {
      /**
         * 新建类型开关变化事件
         */
      const settingCodeInput = document.querySelector('#settingCodeInput')
      if (this.typeValue) {
        this.insertValue.code = 0
        settingCodeInput.disabled = true
      } else {
        this.insertValue.code = ''
        settingCodeInput.disabled = false
      }
    },
    handleUploadDlgClose () {
      /**
         * 关闭上传图片对话框
         */
      this.uploadedImageUrl = ''
      this.uploadDlgVisible = false
    },
    handleUploadSuccess (result, file) {
      /**
         * 确认上传图片成功
         */
      this.uploadedImageUrl = result.data
    },
    beforeUploadUpload (file) {
      /**
         * 检查图片类型与获得上传的 key 与 token
         */
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt500Kb = file.size / 1024 / 1024 < 0.5

      if (!isValid) return this.$message.error('上传图片只能是 jpg 或 png 格式！')
      if (!isLt500Kb) return this.$message.error('上传图片大小不能超过 500kb！')
    }
  }
}
</script>

<style lang="less">
  .setting-list-wrapper {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader {
      .el-upload__tip {
        .uploaded-url {
          margin-top: 10px;
          font-size: 16px;
        }
      }
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
