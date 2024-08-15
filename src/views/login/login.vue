<template>
  <div style="margin: 0; width: 100%; height: 100vh; overflow: hidden; position: relative">
    <div style="width: 100%; height: calc(100% - 300px); margin-top: 150px; position: relative; overflow: hidden">
      <div style="width: 100%; height: calc(100% + 4px); position: absolute; left: 0; top: -2px" class="login-main"></div>
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
        <p class="login-title">欢迎登录</p>
        <el-form-item prop="username" style="width: 90%; margin: 20px auto 0 auto">
          <el-input type="text" placeholder="请输入账号" v-model="form.username">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="width: 90%; margin: 20px auto 0 auto">
          <el-input type="password" placeholder="请输入密码" v-model="form.password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-top: 10px">
          <p style="float: left; margin: 0 0 0 20px; font-size: 16px; color: #ffffff">一周内记住密码</p>
          <el-switch style="margin-left: 15px" v-model="rememberPsw"></el-switch>
        </el-form-item>
        <el-form-item style="width: 90%; margin: 20px auto 0 auto">
          <el-button type="primary" style="width: 100%; height: 45px; border-radius: 8px; font-size: 21px; color: #ffffff; letter-spacing: 10px; text-indent: 10px; line-height: 21px" v-on:click="onSubmit('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="loginLogo"></div> -->
  </div>
</template>

<script>
import request from '@/api/request'
import { resetForm, Notify, baseUrl, downLoad, dateFormat } from '@/api/common'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        urls: '',
        urls2: ''
      },
      // 表单验证，需要在 el-form-item 元素中增加 prop 属性
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      // 对话框显示和隐藏
      dialogVisible: false,
      rememberPsw: true
    }
  },
  mounted() {
    this.getCookie()
  },
  created() {
    document.onkeydown = e => {
      if (window.event === undefined) {
        var key = e.keyCode
      } else {
        // eslint-disable-next-line no-redeclare
        var key = window.event.keyCode
      }
      if (key === 13) {
        this.onSubmit('loginForm')
      }
    }
  },
  // 离开页面后，阻止回车事件
  destroyed() {
    document.onkeydown = undefined
  },
  methods: {
    onSubmit(formName) {
      let that = this
      let Base64 = require('js-base64').Base64
      that.$refs[formName].validate(valid => {
        if (valid) {
          if (that.rememberPsw) {
            that.setCookie(that.form.username, Base64.encode(that.form.password), 7)
          } else {
            that.clearCookie()
          }
          let params = { loginAccount: that.form.username, password: that.form.password }
          // that.$store.state.user.name = that.form.username
          // that.$router.push('/')
          request({
            url: '/user/login',
            method: 'post',
            data: params
          }).then(res => {
            if (res.code == 200) {
              that.getUserInfo()
              sessionStorage.setItem('token', res.data)
              that.$store.state.activeTopRoute = '首页'
              that.$store.state.pathListLeft = {
                title: '首页',
                icon: 'Home',
                path: '/',
                children: []
              }
              that.$router.push('/')
            } else {
              // Notify(res.code == 200 ? 'success' : 'error', res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    getUserInfo() {
      let that = this
      request({ url: '/user/personal_info', method: 'get', params: {} }).then(res => {
        console.log(that.$store.state)
        that.$store.state.userInfo = res.data
        that.$watermark.set(that.$store.state.userInfo.account + '  ' + dateFormat('YYYY-mm-dd HH:MM:SS', new Date()))
      })
    },

    // 设置cookie
    setCookie(name, pwd, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      window.document.cookie = 'userName' + '=' + name + ';expires=' + exdate.toGMTString()
      window.document.cookie = 'password' + '=' + pwd + ';expires=' + exdate.toGMTString()
    },
    // 读取cookie
    getCookie() {
      let Base64 = require('js-base64').Base64
      if (document.cookie.length > 0) {
        let arr = document.cookie.split('; ')
        for (let i = 0; i < arr.length; i++) {
          let arr2 = arr[i].split('=')
          if (arr2[0] == 'userName') {
            this.form.username = arr2[1]
          } else if (arr2[0] == 'password') {
            this.form.password = Base64.decode(arr2[1])
          }
        }
        this.rememberPsw = true
      }
    },
    clearCookie() {
      this.setCookie('', '', -1)
    }
  }
}
</script>

<style>
.login-main {
  background: url('../../assets/login/loginBc2.png') left center no-repeat;
  background-size: 100% 100%;
}
.loginLogo {
  /* background: url('../../assets/login/loginLogo.png'); */
  background-size: 100% 100%;
  position: absolute;
  left: 2%;
  top: 1%;
  width: 27%;
  height: 8%;
}
.login-box {
  background: rgba(13, 10, 169, 0.5);
  width: 320px;
  border-radius: 10px;
  position: absolute;
  top: calc(50% - 190px);
  right: calc(20% - 190px);
  padding: 35px;
}
.login-title {
  font-size: 30px;
  letter-spacing: 7px;
  text-align: center;
  margin: 0 auto 40px auto;
  color: #ffffff;
}
.login-main .el-input__inner {
  border-radius: 8px !important;
  background: none;
  color: #ffffff !important;
  font-size: 20px;
  padding-left: 38px;
}
.login-main .el-input__inner::-webkit-input-placeholder {
  color: #ffffff !important;
}
.login-main .el-input__inner::-moz-placeholder {
  color: #ffffff !important;
}
.login-main .el-input__inner:-ms-input-placeholder {
  color: #ffffff !important;
}
.login-main .el-input__icon {
  color: #ffffff !important;
  font-size: 22px;
  width: 35px;
}
</style>
