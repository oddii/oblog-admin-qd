<template>
  <div class="login-wrapper">
    <!--登录框-->
    <div class="login-inner">

      <div class="login-container">
        <div class="title login-title">后台登录</div>
        <div class="tips login-tips">这个登录是oddblog的后台登录噢~</div>

        <div class="input login-input">
          <input type="email" placeholder="邮箱" v-model="loginForm.email" />
        </div>
        <div class="input login-input">
          <input type="password" placeholder="密码" v-model="loginForm.password"/>
        </div>

        <button class="btn login-btn" @click="login">Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import USER_API_URL from '../../api/userApiUrl'
import api from '../../api/baseApi'
export default {
  name: 'login',
  data () {
    return {
      pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, //  邮箱正则表达式
      loginForm: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      if (!this.loginForm.email) return this.$message.error('登录邮箱不能为空哦~')
      if (!this.pattern.test(this.loginForm.email)) return this.$message.error('登录邮箱格式不合法哦~')
      if (!this.loginForm.password) return this.$message.error('登录密码不能为空哦~')

      if (this.loginForm.password.length < 6) return this.$message.error('登录密码要控制在 6 位或以上哦~')

      const user = {
        email: this.loginForm.email,
        password: this.loginForm.password
      }

      api.insertObject(USER_API_URL.login, user)
        .then(result => {
          const { data } = result
          if (data.code !== 200) return this.$message.error(data.msg)

          window.localStorage.setItem('oblog-token', data.data)
          this.$message.success(data.msg)
          this.clearLoginForm()
          this.$router.push('/index')
        })
        .catch(error => {
          if (error.response) {
            return this.$message.error('服务器出现错误，请稍后再试')
          }
        })
    },
    clearLoginForm () {
      /**
       * 清理登录框
       */
      this.loginForm.email = ''
      this.loginForm.password = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .login-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #eeeeee;

    .login-inner{
      width: 450px;
      background-color: #fff;
      height: 500px;
      border-radius: 10px;
      box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
      transition: all .5s;
    }

    .login-inner{
      .login-container{
        display: flex;
        flex-direction: column;
        align-items: center;

        .login-title{
          color: #a29bfe;
        }

        .login-forget{
          font-size: 16px;
          color: #8c53ff;
          margin: 50px 0 20px;
          cursor: pointer;
        }
      }
    }

    .title{
      margin-top: 70px;
      padding: 15px 0;
      font-size: 30px;
      font-weight: bold;
    }

    .tips{
      padding-bottom: 15px;
      font-size: 15px;
      color: #777;
      margin-bottom: 30px;
    }

    .input{
      width: 230px;
      margin-bottom: 8px;
      input{
        display: block;
        width: 100%;
        padding: .375rem .75rem;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #a29bfe;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;

        &:focus{
          box-shadow: 0 0 1rem rgba(0,0,0,.1)!important;
        }
      }
    }

    .btn{
      width: 200px;
      height: 47px;
      font-size: 20px;
      font-weight: 600;
      margin-top: 60px;
      background-color: #a29bfe;
      color: #fff;
      border-radius: 20px;
      transition: background-color .5s;

      &:hover{
        color: #a29bfe;
        background-color: #fff;
        border: 1px solid #a29bfe;
      }
    }
  }
</style>
