<template>
  <div class="edit-wrapper">
    <!--编辑头部区域-->
    <div class="edit-header-wrapper">
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          <!--博客标题区域-->
          <div class="edit-title-container">
            <span class="edit-item">标题：</span>
            <el-input size="small" v-model="title"/>
          </div>
        </el-col>

        <el-col :span="5">
          <!--博客作者区域-->
          <div class="edit-author-container">
            <span class="edit-item">作者：</span>
            <el-input size="small" v-model="author"/>
          </div>
        </el-col>

        <el-col :span="7">
          <!--博客来源区域-->
          <div class="edit-from-container">
            <span class="edit-item">来源：</span>
            <el-input size="small" placeholder="若为原创，则不用填写" v-model="source"/>
          </div>
        </el-col>
      </el-row>

    </div>

    <div class="edit-header-wrapper">
      <el-row type="flex" justify="space-between">
        <el-col :span="3">
          <!--博客专栏区域-->
          <div class="edit-column-container">
            <span class="edit-item">专栏：</span>
            <el-select v-model="flag" filterable placeholder="请选择" size="small" style="width: 90px;">
              <el-option v-for="item in flagOptions" :key="item.value"
                         :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="5">
          <!--博客分类区域-->
          <div class="edit-type-container">
            <span class="edit-item">分类：</span>
            <el-select v-model="type" filterable placeholder="请选择" size="small" style="width: 150px;">
              <el-option v-for="item in typeOptions" :key="item.value"
                         :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="15">
          <!--博客标签区域-->
          <div class="edit-tag-container">
            <span class="edit-item">标签：</span>
            <span v-if="tagOptions !== ''">
              <el-tag v-for="(item,index) in tagOptions.split(' ')" :key="index" @close="handleCloseTag(item)"
                      class="tag-item" closable effect="plain">
                {{item}}
              </el-tag>
            </span>
            <!--新增标签按钮，最多只能添加5个标签-->
            <el-button icon="el-icon-plus" @click="showInsertTagDlg" size="small"
                       v-if="tagOptions.split(' ').length < 5">
              New Tag
            </el-button>
          </div>
        </el-col>

      </el-row>
    </div>

    <!--编辑主体区域-->
    <div class="edit-main-wrapper">
      <mavon-editor v-model="content" style="min-height: 522px" @imgAdd="uploadMdImage" ref="md"/>
    </div>

    <!--编辑底部区域-->
    <div class="edit-bottom-wrapper">
      <!--开关按钮区域-->
      <div class="switch-wrapper">
        <div class="switch-item">
          <span class="edit-item">赞赏功能：</span>
          <el-switch v-model="appreciationAble" :active-value="1" :inactive-value="0"
                     active-color="#a29bfe" inactive-color="#ff4949"/>
        </div>
        <div class="switch-item">
          <span class="edit-item">评论功能：</span>
          <el-switch v-model="commentAble" :active-value="1" :inactive-value="0"
                     active-color="#a29bfe" inactive-color="#ff4949"/>
        </div>
        <div class="switch-item">
          <span class="edit-item">版权功能：</span>
          <el-switch v-model="copyrightAble" :active-value="1" :inactive-value="0"
                     active-color="#a29bfe" inactive-color="#ff4949"/>
        </div>
      </div>

      <div class="btn-wrapper">
        <el-button size="medium" type="primary" plain round @click="uploadDlgVisible = true">修改首图</el-button>
        <el-button class="btn-item" type="info" size="medium" plain round @click="save">保存</el-button>
        <el-button class="btn-item" type="primary" size="medium" round @click="submit">发布</el-button>
      </div>
    </div>

    <!--添加标签对话框-->
    <el-dialog title="新增标签" :visible.sync="insertTagDlgVisible" width="23%" :before-close="handleInsertTagDlgClose">
      <span class="edit-item">选择标签：</span>
      <el-select v-model="insertTagValue" filterable placeholder="请选择" size="small" >
        <el-option v-for="item in insertTagList" :key="item.value"
                   :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer">
        <el-button @click="handleInsertTagDlgClose" round>取消</el-button>
        <el-button type="primary" @click="handleInsertTag" round>确定</el-button>
      </span>
    </el-dialog>

    <!--修改首图对话框-->
    <el-dialog title="修改首图" :visible.sync="uploadDlgVisible"
               width="1042px" :before-close="handleUploadDlgClose" >

      <el-upload class="avatar-uploader" :action="uploadAction" :show-file-list="false"
                 :on-success="handleUploadSuccess" :before-upload="beforeUploadUpload" style="height: 555px">
        <img v-if="firstPicture" :src="firstPicture" class="avatar"/>
        <i v-else class="el-icon-plus avatar-uploader-icon"/>

        <div class="el-upload__tip" slot="tip">
          <div>只能上传jpg/png文件，且不超过2M</div>
          <div class="uploaded-url">图片url：
            <a style="text-decoration: solid;color: #409EFF;font-size: 14px"
               target="_blank" :href="firstPicture">{{firstPicture}}</a>
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
import TYPE_API_URL from '../../../api/typeApiUrl'
import TAG_API_URL from '../../../api/tagApiUrl'
import formatUtils from '../../../utils/formatUtils'
import BLOG_API_URL from '../../../api/blogApiUrl'
import COMMON_API_URL from '../../../api/commonApiUrl'
import config from '../../../utils/config'
export default {
  name: 'blog-edit',
  created () {
    this.getTypeList()
    this.getTagList()
  },
  mounted () {
    this.judgeBlogStatus()
  },
  data () {
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
      uploadDlgVisible: false, //  上传图片对话框
      isNewBlog: true, //  是否为新博客
      insertTagDlgVisible: false, //  新增标签对话框显示与否
      insertTagValue: '', //  新增标签的值
      insertTagValueList: [], //  新建标签列表
      insertTagList: [], //  新增标签的列表
      editBeforeValue: {}, //  修改之前的博客
      id: '', //  博客id
      title: '', //  标题
      author: '', //  作者
      source: '', //  来源
      content: '', //  内容
      flagOptions: [
        {
          value: 0,
          label: '原创'
        },
        {
          value: 1,
          label: '转载'
        }], //  专栏选项
      flag: '', //  专栏默认值
      typeOptions: [], //  分类选项
      type: '', //  分类默认值
      tagOptions: '', //  标签列表，以空格分隔
      appreciationAble: true, //  赞赏开关
      commentAble: true, //  评论开关
      copyrightAble: true, //  版权开关
      firstPicture: '', //  首图url地址
      status: 0 //  博客发布状态
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
            this.insertTagList.push({
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
    judgeBlogStatus () {
      /**
       * 判断博客状态
       */
      if (this.$route.params.id !== ':id') {
        this.isNewBlog = false
        this.id = this.$route.params.id
        this.getBlogById(this.id)
      } else {
        this.isNewBlog = true
      }
    },
    getBlogById (id) {
      api.getObjectById(BLOG_API_URL.getBlogById, id)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          const blog = data.data.blog
          this.title = blog.title
          this.author = blog.author
          this.source = blog.source
          this.type = blog.type
          this.content = blog.content
          this.flag = blog.flag
          this.tagOptions = blog.tag
          this.appreciationAble = blog.appreciationAble
          this.commentAble = blog.commentAble
          this.copyrightAble = blog.copyrightAble
          this.firstPicture = blog.firstPicture
          this.status = blog.status
          this.insertTagValueList = this.tagOptions.split(' ')

          this.editBeforeValue = {
            // id: this.id,
            title: blog.title
            // author: data.data.author,
            // source: data.data.source,
            // type: data.data.type,
            // content: data.data.content,
            // flag: data.data.flag,
            // tag: data.data.tag,
            // appreciationAble: data.data.appreciationAble,
            // commentAble: data.data.commentAble,
            // copyrightAble: data.data.copyrightAble,
            // status: data.data.status
          }
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('获取标签列表失败，服务器出现错误，请稍后再试')
          }
        })
    },
    showInsertTagDlg () {
      /**
       * 展示新增标签的对话框
       */
      this.insertTagDlgVisible = true
    },
    handleInsertTagDlgClose () {
      /**
       * 新增标签对话框关闭前的事件
       */
      this.insertTagValue = ''
      this.insertTagDlgVisible = false
    },
    handleInsertTag () {
      /**
       * 增加标签，最多只能增加5个标签
       */
      const isInserted = this.insertTagValueList.some(item => {
        return item === this.insertTagValue
      })

      if (isInserted) return this.$message.error('本文已添加该标签，请勿重复添加')
      this.insertTagValueList.push(this.insertTagValue)

      this.tagOptions = this.insertTagValueList.join(' ')
      this.handleInsertTagDlgClose()
    },
    handleCloseTag (tag) {
      /**
       * 删除当前标签
       */
      this.insertTagValueList.splice(this.insertTagValueList.indexOf(tag), 1)
      this.tagOptions = this.insertTagValueList.join(' ')
    },
    insertBlog () {
      /**
       * 新建博客
       */
      const blog = {
        title: this.title,
        content: this.content,
        author: this.author,
        source: this.source,
        firstPicture: this.firstPicture,
        flag: this.flag,
        type: this.type,
        tag: this.tagOptions,
        appreciationAble: formatUtils.formatBoolean(this.appreciationAble),
        commentAble: formatUtils.formatBoolean(this.commentAble),
        copyrightAble: formatUtils.formatBoolean(this.copyrightAble),
        status: this.status
      }

      api.insertObject(BLOG_API_URL.insertBlog, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 201) return this.$message.error(data.msg)

          return this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    editBlog () {
      /**
       * 修改博客
       */

      const blog = {
        id: this.id,
        content: this.content,
        author: this.author,
        source: this.source,
        firstPicture: this.firstPicture,
        flag: this.flag,
        type: this.type,
        tag: this.tagOptions,
        appreciationAble: this.appreciationAble,
        commentAble: this.commentAble,
        copyrightAble: this.copyrightAble,
        status: this.status
      }

      if (this.title !== this.editBeforeValue.title) {
        blog.title = this.title
      }

      api.updateObjectById(BLOG_API_URL.updateBlogById, blog.id, blog)
        .then(result => {
          const { data } = result
          if (data.code !== 203) return this.$message.error(data.msg)

          return this.$message.success(data.msg)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    },
    save () {
      /**
       * 保存
       */
      this.status = 0
      if (this.title === '' || this.title === null) {
        return this.$message.error('操作失败，博文标题不能为空')
      }
      if (this.author === '' || this.author === null) {
        return this.$message.error('操作失败，博文作者不能为空')
      }
      if (this.content === '' || this.content === null) {
        return this.$message.error('操作失败，博文内容不能为空')
      }
      if (this.flag === '' || this.flag === null) {
        return this.$message.error('操作失败，博文专栏不能为空')
      }
      if (this.type === '' || this.type === null) {
        return this.$message.error('操作失败，博文分类不能为空')
      }
      if (this.tagOptions === '' || this.tagOptions === null) {
        return this.$message.error('操作失败，博文标签不能为空')
      }
      if (this.firstPicture === '' || this.firstPicture === null) {
        return this.$message.error('操作失败，博文首图不能为空')
      }

      if (this.isNewBlog) this.insertBlog()
      else this.editBlog()
    },
    submit () {
      /**
       * 发布
       */
      this.status = 1
      if (this.title === '' || this.title === null) {
        return this.$message.error('操作失败，博文标题不能为空')
      }
      if (this.author === '' || this.author === null) {
        return this.$message.error('操作失败，博文作者不能为空')
      }
      if (this.content === '' || this.content === null) {
        return this.$message.error('操作失败，博文内容不能为空')
      }
      if (this.firstPicture === '' || this.firstPicture === null) {
        return this.$message.error('操作失败，博文首图不能为空')
      }
      if (this.flag === '' || this.flag === null) {
        return this.$message.error('操作失败，博文专栏不能为空')
      }
      if (this.type === '' || this.type === null) {
        return this.$message.error('操作失败，博文分类不能为空')
      }
      if (this.tagOptions === '' || this.tagOptions === null) {
        return this.$message.error('操作失败，博文标签不能为空')
      }

      if (this.isNewBlog) this.insertBlog()
      else this.editBlog()

      this.$router.push('/blog/list')
    },
    handleUploadDlgClose () {
      /**
       * 关闭上传图片对话框
       */
      this.uploadDlgVisible = false
    },
    handleUploadSuccess (result, file) {
      /**
       * 确认上传图片成功
       */
      // console.log(result)
      // console.log(file)
      this.firstPicture = result.data
      if (!this.isNewBlog) this.editBlog()
    },
    beforeUploadUpload (file) {
      /**
       * 检查图片类型与获得上传的 key 与 token
       */
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt500Kb = file.size / 1024 / 1024 < 1

      if (!isValid) return this.$message.error('上传图片只能是 jpg 或 png 格式！')
      if (!isLt500Kb) return this.$message.error('上传图片大小不能超过 1M！')

      /**
       *       this.uploadData.key = Utils.getUUId()
       //  如果这个页面的 token 为空，就发请求获得 token
       if (!this.uploadData.token) {
        await api.getObject(COMMON_API_URL.getUploadToken, {})
          .then(result => {
            const { data } = result
            if (data.code !== 200) return this.$message.error('服务器出现错误，请稍后再试')
            this.uploadData.token = data.data
          })
          .catch(error => {
            if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
          })
      }
       *
       */
    },
    uploadMdImage (pos, file) {
      /**
       * 上传 mavon-editor 的图片
       */
      const isValid = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt500Kb = file.size / 1024 / 1024 < 1

      if (!isValid) return this.$message.error('上传图片只能是 jpg 或 png 格式！')
      if (!isLt500Kb) return this.$message.error('上传图片大小不能超过 1M！')

      const formData = new FormData()
      formData.append('file', file)
      api.uploadObject(COMMON_API_URL.uploadImage2AliyunOSS, formData)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          const url = data.data
          this.$refs.md.$img2Url(pos, url)
        })
        .catch(error => {
          if (error.response) return this.$message.error('服务器出现错误，请稍后再试')
        })
    }
  }
}
</script>

<style lang="less">
  .edit-wrapper {
    .edit-item {
      width: 70px;
      color: #2d3436;
      font-size: 17px;
      font-weight: 600;
    }

    .edit-header-wrapper {
      /*display: flex;*/
      margin-bottom: 20px;

      .edit-title-container,
      .edit-author-container,
      .edit-from-container,
      .edit-column-container,
      .edit-tag-container,
      .edit-type-container,
      .edit-switch-container{
        display: flex;
        align-items: center;
      }

      .edit-tag-container {
        .tag-item {
          margin-right: 15px;
        }
      }
    }

    .edit-main-wrapper {
      margin-bottom: 25px;
    }

    .edit-bottom-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .switch-wrapper{
        display: flex;
        .switch-item{
          margin-right: 25px;
        }
      }
      .btn-wrapper {
        .btn-item {
          width: 98px !important;
        }
      }
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader{
      .el-upload__tip{
        .uploaded-url{
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
      width: 1000px;
      height: 545px;
      line-height: 545px;
      text-align: center;
    }
    .avatar {
      width: 1000px;
      height: 545px;
      display: block;
    }
  }
</style>
