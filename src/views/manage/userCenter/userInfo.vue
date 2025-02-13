<template>
  <div class="manageMain userInfo">
    <div class="userUnit">
      <p class="title">基本信息</p>
      <div class="userUnit-box">
        <div class="userUnit-item">
          <p class="userUnit-item-title">个人账号:</p>
          <p class="userUnit-item-content">{{ $store.state.userInfo.account }}</p>
          <div class="userUnit-item-button">
            <el-button type="text" @click="showPassWord()"> 修改密码 </el-button>
          </div>
        </div>
        <div class="userUnit-item">
          <p class="userUnit-item-title">真实姓名:</p>
          <p class="userUnit-item-content">{{ $store.state.userInfo.fullName }}</p>
        </div>
        <div class="userUnit-item">
          <p class="userUnit-item-title">邮箱:</p>
          <p class="userUnit-item-content">{{ $store.state.userInfo.email }}</p>
        </div>
        <div class="userUnit-item">
          <p class="userUnit-item-title">手机号:</p>
          <p class="userUnit-item-content">{{ $store.state.userInfo.phone }}</p>
        </div>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogShowPassWord" width="550px">
      <el-form :model="formPassWord" ref="formPassWord" label-width="120px" :rules="rules" :show-message="false" class="demo-ruleForm">
        <div style="width: 100%; margin: 0 auto; height: auto">
          <el-row :gutter="24">
            <el-col :span="24">
              <el-form-item label="账号：" prop="account">
                <el-input v-model.trim="formPassWord.account" autocomplete="off" disabled> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="旧密码：" :required="true" prop="oldPassWord">
                <el-input v-model.trim="formPassWord.oldPassWord" autocomplete="off" placeholder="请输入旧密码"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="新密码：" :required="true" prop="newPassword">
                <el-input v-model.trim="formPassWord.newPassword" autocomplete="off" placeholder="请输入新密码"> </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowPassWord = false" style="width: 100px" size="mini">取 消</el-button>
        <el-button type="primary" @click="changePassWord()" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'userInfo',

  data() {
    return {
      buttonLoad: false,

      formPassWord: {
        account: '',
        newPassword: '',
        oldPassWord: ''
      },
      dialogShowPassWord: false
    }
  },
  mounted() {},
  methods: {
    showPassWord() {
      let that = this
      that.dialogShowPassWord = true
      that.buttonLoad = false
      resetForm('formPassWord', that)
      that.formPassWord = {
        account: that.$store.state.userInfo.account,
        newPassword: '',
        oldPassWord: ''
      }
    },
    changePassWord() {
      let that = this
      that.$refs['formPassWord'].validate(valid => {
        if (valid) {
          let regex4 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/
          if (!regex4.test(that.formPassWord.newPassword)) {
            return Notify('error', '密码应该是数字、大小写字母、特殊字符的最少8位组合,请重新输入！')
          }
          that.buttonLoad = true
          request({ url: '/user/change_password', method: 'post', data: that.formPassWord })
            .then(res => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
              if (res.code == '200') {
                Notify('success', res.message || '密码修改成功，请重新登录，即将跳转登录页。')
                that.dialogShowPassWord = false
                setTimeout(() => {
                  sessionStorage.removeItem('vuex')
                  sessionStorage.removeItem('token')
                  that.$router.push('/login')
                }, 3000)
              }
            })
            .catch(() => {
              setTimeout(() => {
                that.buttonLoad = false
              }, 300)
            })
        }
      })
    }
  }
}
</script>

<style>
.userInfo .userUnit {
  width: 100%;
  height: auto;
}
.userInfo .userUnit .title {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: left;
  font-size: 16px;
  margin: 0;
  border-bottom: 1px solid #dcdfe6;
}
.userInfo .userUnit .userUnit-box {
  margin-top: 10px;
  width: 100%;
  height: auto;
}
.userInfo .userUnit .userUnit-box .userUnit-item {
  width: 96%;
  height: 60px;
  line-height: 60px;
  margin: 0 auto;
  font-size: 14px;
  border-bottom: 1px dashed #eaeaea;
}
.userInfo .userUnit .userUnit-box .userUnit-item .userUnit-item-title {
  width: 160px;
  margin: 0;
  float: left;
  height: 60px;
  line-height: 60px;
  text-align: right;
}
.userInfo .userUnit .userUnit-box .userUnit-item .userUnit-item-content {
  width: calc(100% - 382px);
  margin: 0 0 0 20px;
  float: left;
  height: 60px;
  line-height: 60px;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.userInfo .userUnit .userUnit-box .userUnit-item .userUnit-item-button {
  width: 200px;
  height: 60px;
  margin: 0;
  float: right;
  text-align: right;
}
.userInfo .userUnit .userUnit-box .userUnit-item .userUnit-item-button .el-button {
  font-size: 16px;
}
</style>
