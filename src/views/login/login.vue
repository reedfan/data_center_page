<template>
  <div style="margin: 0; width: 100%; height: 100vh; overflow: hidden; position: relative">
    <div style="width: 100%; height: 100%; margin-top: 0; position: relative; overflow: hidden">
      <div style="width: 100%; height: calc(100% + 4px); position: absolute; left: 0; top: -2px" class="login-main">
        <div class="titleUnit">
          <p>数据中台</p>
          <p>数据建模·模型设计·自助分析·离线开发</p>
        </div>
        <div class="loginLeft"></div>
        <!-- <p class="bottomP">建设单位: 安徽省征信股份有限公司 皖ICP备10200073号</p> -->
      </div>
      <el-form ref="loginForm" :model="form" :rules="rules" class="login-box">
        <p class="login-title">登录</p>
        <el-form-item prop="username" style="width: calc(100% - 100px); margin: 0 auto">
          <el-input type="text" placeholder="请输入账号" v-model="form.username">
            <i slot="prefix" class="el-input__icon el-icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" style="width: calc(100% - 100px); margin: 30px auto 0 auto">
          <el-input type="password" placeholder="请输入密码" v-model="form.password">
            <i slot="prefix" class="el-input__icon el-icon-lock"></i>
          </el-input>
        </el-form-item>
        <el-form-item style="text-align: right; width: calc(100% - 100px); margin: 10px auto 0 auto">
          <el-switch style="margin-left: 10px; float: right; margin-top: 6px" v-model="rememberPsw"></el-switch>
          <p style="float: right; margin: 0; font-size: 16px; color: #ffffff; height: 32px; line-height: 32px">一周内记住密码</p>
        </el-form-item>
        <el-form-item style="width: calc(100% - 100px); margin: 20px auto 0 auto">
          <el-button v-loading="loginLoading" style="width: 100%; height: 50px; border-radius: 2px; font-size: 20px; color: rgba(33, 33, 33, 1); letter-spacing: 5px; text-indent: 5px; line-height: 21px; background: rgba(255, 255, 255, 1)" v-on:click="onSubmit('loginForm')">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
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
        password: ''
      },
      loginLoading: false,
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
          that.loginLoading = true
          request({
            url: '/user/login',
            method: 'post',
            data: params
          }).then(res => {
            if (res.code == 200) {
              that.loginLoading = false
              that.getUserInfo()
              sessionStorage.setItem('token', res.data.token)
              that.$store.state.activeTopRoute = '首页'
              that.$store.state.pathListLeft = {
                title: '首页',
                icon: 'Home',
                path: '/',
                children: []
              }
              that.$store.state.sortPathList = []
              that.$store.state.pathList.forEach(x => {
                if (res.data.adminInfo || !x.adminInfo) {
                  that.$store.state.sortPathList.push(x)
                }
              })
              that.$router.push('/')
            } else {
              that.loginLoading = false
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
  background: url('../../assets/login/loginBack.png') left center no-repeat;
  background-size: 100% 100%;
}
.login-main .loginLeft {
  position: absolute;
  left: calc(20% - 70px);
  width: 403px;
  top: calc(50% - 150px);
  height: 380px;
  background: url('../../assets/login/loginLeft.png') left center no-repeat;
  background-size: 100% 100%;
}
.login-main .titleUnit {
  position: absolute;
  left: calc(20% - 170px);
  width: 600px;
  height: 104px;
  top: calc(50% - 314px);
}
.login-main .titleUnit > p:nth-child(1) {
  font-size: 56px;
  text-align: center;
  height: 56px;
  line-height: 56px;
  color: rgba(37, 40, 43, 1);
  letter-spacing: 3px;
  font-weight: 400;
  margin: 0;
}
.login-main .titleUnit > p:nth-child(2) {
  font-size: 27px;
  text-align: center;
  height: 27px;
  line-height: 27px;
  color: rgba(69, 69, 69, 1);
  letter-spacing: 1px;
  margin: 21px auto 0 auto;
}
.login-main .bottomP {
  position: absolute;
  bottom: 72px;
  width: 80%;
  left: 10%;
  text-align: center;
  color: rgba(45, 45, 45, 1);
  font-size: 16px;
  height: 16px;
  line-height: 16px;
  margin: 0;
}

.login-box {
  background: rgba(0, 67, 164, 0.68);
  width: 440px;
  border-radius: 1px;
  position: absolute;
  top: calc(50% - 233px);
  right: calc(20% - 190px);
  padding: 40px 0 50px 0;
}
.login-title {
  font-size: 30px;
  letter-spacing: 7px;
  text-align: center;
  margin: 0 auto 40px auto;
  color: #ffffff;
}
.login-box .el-input__inner {
  border-radius: 2px !important;
  background: none;
  height: 50px;
  line-height: 50px;
  color: #ffffff !important;
  font-size: 18px;
  padding-left: 38px;
}
.login-box .el-input__inner::-webkit-input-placeholder {
  color: #ffffff !important;
}
.login-box .el-input__inner::-moz-placeholder {
  color: #ffffff !important;
}
.login-box .el-input__inner:-ms-input-placeholder {
  color: #ffffff !important;
}
.login-box .el-input__icon {
  color: #ffffff !important;
  font-size: 22px;
  line-height: 56px;
  width: 35px;
}
</style>
