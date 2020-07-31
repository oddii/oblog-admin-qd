<template>
  <div class="layout-wrapper">
    <el-container>
      <!--侧边栏-->
      <el-aside width="250px" id="aside">

        <!--个人信息展示区域-->
        <div class="info-wrapper">
          <div class="info-title">oblog 后台</div>
          <div class="info-container">
            <div class="info-avatar">
              <el-avatar icon="el-icon-user-solid" :size="50" :src="userInfo.avatar"/>
            </div>
            <div class="info">
              <div class="info-name">{{userInfo.nickname}}</div>
              <div class="info-role">{{userInfo.role | formatUserRole}}</div>
            </div>
          </div>
        </div>

        <el-menu :default-active="$route.path" :router="true" :unique-opened="true"
                  text-color="#999" active-text-color="#6c5ce7">
          <div v-for="item in asideBarList" :key="item.path" >
            <!--首页栏-->
            <el-menu-item :index="item.path" v-if="item.path === '/index'">
              <i :class="item.meta.icon"/>
              <span slot="title">{{item.meta.title}}</span>
            </el-menu-item>

            <!--非首页的下拉菜单-->
            <el-submenu :index="item.path" v-else>
              <template slot="title">
                <i :class="item.meta.icon"/>
                <span slot="title">{{item.meta.title}}</span>
              </template>

              <el-menu-item v-for="children in item.children" :key="children.path" :index="children.path">
                <i :class="children.meta.icon"/>
                <span slot="title">{{children.meta.title}}</span>
              </el-menu-item>
            </el-submenu>

          </div>
        </el-menu>

        <!--退出登录区域-->
        <div class="logout-container">
          <el-button type="danger" icon="el-icon-coordinate" round class="btn-logout" @click="logout">退出登录</el-button>
        </div>
      </el-aside>

      <el-container>
        <!--top栏-->
        <el-header height="110px">
          <div class="header-bar">
            <!--侧边栏折叠按钮-->
            <div class="btn-fold" @click="handleFold">
              <i :class="[isFold === false ?'el-icon-s-fold':'el-icon-s-unfold' ]"/>
            </div>

            <!--全屏按钮-->
            <div class="btn-fullScreen" @click="handleFullScreen">
              <i class="el-icon-full-screen"/>
            </div>

            <div class="btn-unFullScreen hidden" @click="handleUnFullScreen">
              <i class="el-icon-crop"/>
            </div>

            <!--跳转博客首页按钮-->
            <div class="btn-goto" @click="handleGoTo">
              <i class="el-icon-s-promotion"/>
            </div>

          </div>
          <nav class="header-nav"  style="border-radius:12px;">
            <div class="title-container">
              <i :class="$route.meta.icon"/>
              <span>{{$route.meta.title}}</span>
            </div>
          </nav>
        </el-header>

        <!--主题内容-->
        <el-main style="border-radius:12px;">
            <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import api from '../api/baseApi'
import USER_API_URL from '../api/userApiUrl'
export default {
  name: 'layout',
  created () {
    this.token = window.localStorage.getItem('oblog-token') || undefined
    if (this.token) {
      this.getUserInfo(this.token)
    }
  },
  data () {
    return {
      token: '',
      isFold: false, //  侧边栏是否展开折叠
      isFullScreen: false, //  是否全屏
      asideBarList: this.$router.options.routes[2].children, //  侧边栏菜单列表，根据路由动态生成
      userInfo: {}
    }
  },
  methods: {
    getUserInfo (token) {
      /**
       * 获得用户信息
       */
      api.getObjectById(USER_API_URL.getUserByToken, token)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return
          this.userInfo = data.data
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    handleFold () {
      /**
       * 侧边栏展开折叠事件
       */
      const aside = document.getElementById('aside')
      if (!this.isFold) aside.style.width = 0
      else aside.style.width = 250 + 'px'
      this.isFold = !this.isFold
    },
    handleFullScreen () {
      /**
       * 全屏事件
       */
      const btnFull = document.querySelector('.btn-fullScreen') //  全屏按钮
      const btnUnFull = document.querySelector('.btn-unFullScreen') //  取消全屏按钮
      btnFull.classList.add('hidden')
      btnUnFull.classList.remove('hidden')

      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen()
      }
    },
    handleUnFullScreen () {
      /**
       * 退出全屏事件
       */
      const btnFull = document.querySelector('.btn-fullScreen') //  全屏按钮
      const btnUnFull = document.querySelector('.btn-unFullScreen') //  取消全屏按钮
      btnUnFull.classList.add('hidden')
      btnFull.classList.remove('hidden')

      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
    handleGoTo () {
      /**
       * 跳转去博客首页
       */
    },
    logout () {
      /**
       * 退出登录
       */
      window.localStorage.removeItem('oblog-token')
      this.$router.push('/login')
    }
  },
  mounted () {
    window.onresize = function () {
      /**
       * 监听屏幕发生的变化
       */
      this.isFullScreen = !this.isFullScreen
      const btnFull = document.querySelector('.btn-fullScreen') //  全屏按钮
      const btnUnFull = document.querySelector('.btn-unFullScreen') //  取消全屏按钮

      if (this.isFullScreen) {
        btnFull.classList.add('hidden')
        btnUnFull.classList.remove('hidden')
      } else {
        btnUnFull.classList.add('hidden')
        btnFull.classList.remove('hidden')
      }
    }
  },
  filters: {
    formatUserRole (role) {
      if (role === 1) return '超级管理员'
      else return '普通用户'
    }
  }
}
</script>

<style lang="less" scoped>
  .layout-wrapper {
    height: 100%;

    .el-aside{

      .info-wrapper{
        .info-title{
          width: 100px;
          margin: 20px auto 30px;
          font-size: 18px;
          font-weight: 600;
          color: #2d3436;
        }

        .info-container{
          display: flex;
          align-items: center;
          margin-bottom: 15px;

          .info-avatar{
            margin: 0 10px 0 15px;
          }

          .info-name,
          .info-role{
            font-size: 14px;
          }

          .info-role{
            color: #6c5ce7;
          }
        }
      }

      .logout-container{
        margin-top: 30px;
        display: flex;
        justify-content: center;

        .btn-logout{
          width: 200px !important;
        }
      }
    }

    .el-container{
      position: relative;
      min-height: 100%;

      .header-bar{

        .btn-fold,
        .btn-fullScreen,
        .btn-unFullScreen,
        .btn-goto{
          position: absolute;
          top: 20px;
          font-size: 30px;
          font-weight: 600;
          color: white;
          cursor: pointer;
        }

        .btn-fold{
          left: 26px;
        }

        .btn-fullScreen{
          right: 80px;
        }

        .btn-unFullScreen{
          right: 80px;
        }

        .btn-goto{
          right: 30px;
        }
      }

      .header-nav{
        position: absolute;
        top: 73px;
        left: 50%;
        margin-left: -47.5%;
        width: 95%;
        height: 71px;
        background-color: white;
        box-shadow: 2px 0 10px rgba(0,0,0,.1);

        .title-container{
          height: 100%;
          display: flex;
          align-items: center;
          font-size: 22px;
          font-weight: 600;
          color: #2d3436;

          i{
            font-size: 24px;
            margin: 0 10px 0 25px;
            color: #6c5ce7;
          }
        }
      }

      .el-main{
        width: 95%;
        height: 100%;
        margin: 65px auto 35px;
        box-shadow: 2px 0 12px 0 rgba(0,0,0,.1);;
      }
    }
  }
</style>
