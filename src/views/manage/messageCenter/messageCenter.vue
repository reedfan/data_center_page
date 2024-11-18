<template>
  <div style="overflow: hidden" class="manageMain messageCenter">
    <div class="tableArea" v-loading="loadingMessage">
      <div class="messageUnit" v-for="(item, index) in dataMessage" :key="index">
        <p>API权限申请</p>
        <p>
          申请API：
          <el-popover placement="right" width="400" trigger="hover">
            <el-descriptions title="" :column="2" border size="small">
              <el-descriptions-item>
                <template slot="label"> API名称 </template>
                {{ item.autoApiInfo.apiName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 请求方式 </template>
                {{ item.autoApiInfo.apiMethod }}
              </el-descriptions-item>
              <el-descriptions-item span="2">
                <template slot="label"> API Path </template>
                {{ item.autoApiInfo.apiPath }}
              </el-descriptions-item>
              <el-descriptions-item span="2">
                <template slot="label"> 表名 </template>
                {{ item.autoApiInfo.apiTableName }}
              </el-descriptions-item>
              <el-descriptions-item span="2">
                <template slot="label"> 描述 </template>
                {{ item.autoApiInfo.apiDesc }}
              </el-descriptions-item>
            </el-descriptions>
            <span slot="reference" style="color: #1e69ff; cursor: pointer">{{ item.autoApiInfo.apiName }}</span>
          </el-popover>
          &nbsp;&nbsp;&nbsp;&nbsp;申请项目：
          <el-popover placement="right" width="400" trigger="hover">
            <el-descriptions title="" :column="2" border size="small">
              <el-descriptions-item span="2">
                <template slot="label"> 项目名称 </template>
                {{ item.projectInfo.projectName }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 创建人 </template>
                {{ item.projectInfo.createBy }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label"> 创建时间 </template>
                {{ item.projectInfo.createTime }}
              </el-descriptions-item>

              <el-descriptions-item span="2">
                <template slot="label"> 项目描述 </template>
                {{ item.projectInfo.projectDesc }}
              </el-descriptions-item>
            </el-descriptions>
            <span slot="reference" style="color: #1e69ff; cursor: pointer">{{ item.projectInfo.projectName }}</span>
          </el-popover>
        </p>
        <p>申请人：{{ item.permissionPerson }} &nbsp;&nbsp;&nbsp;&nbsp;申请时间：{{ item.createTime }}</p>
        <div class="messageFoot">
          <el-button type="danger" @click="updateMessage(item, false)" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">驳 回</el-button>
          <el-button type="primary" @click="updateMessage(item, true)" :disabled="buttonLoad" :loading="buttonLoad" style="width: 100px" size="mini">通 过</el-button>
        </div>
      </div>
      <el-empty style="width: 100%; height: 100%" description="暂无数据" v-if="dataMessage.length == 0"></el-empty>
    </div>
  </div>
</template>

<script>
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'messageCenter',
  data() {
    return {
      empty: '',
      rules: {
        test: []
      },
      buttonLoad: false,

      queryForm: {
        pageSize: 20,
        page: 1,
        total: 0
      },
      dataMessage: [],
      loadingMessage: true
    }
  },
  mounted() {
    this.getDataMessage()
    window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
      })()
    }
  },

  methods: {
    // 获取api审核消息
    getDataMessage() {
      let that = this
      that.loadingMessage = true
      request({ url: '/auto_api/notify', method: 'get', params: {} }).then(res => {
        that.dataMessage = res.data || []
        that.loadingMessage = false
        that.queryForm.total = res.data ? res.data.length : 0
        that.$store.state.messageNum = res.data ? res.data.length : 0
      })
    },
    updateMessage(item, flag) {
      let that = this
      that.buttonLoad = true
      request({ url: '/permission/update', method: 'post', data: { id: item.id, permissionState: flag, delFlag: !flag } }).then(res => {
        res.code == 200 && (Notify('success', res.message || '处理成功'), that.getDataMessage())
        setTimeout(() => {
          that.buttonLoad = false
        }, 300)
      })
    }
  }
}
</script>

<style scoped>
</style>
