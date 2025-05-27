<template>
  <div style="width: 880px; height: auto; overflow: hidden; position: relative; margin-top: 20px" class="chatBiDataBox">
    <el-divider content-position="left">总结 </el-divider>
    <div style="width: 878px; transition: 0.3s; height: auto; overflow: hidden auto; background: #ffffff; position: relative" v-loading="reportLoading">
      <v-md-editor v-model="reportText" style="height: calc(100% - 40px); margin-top: 20px" mode="preview"></v-md-editor>
    </div>
  </div>
</template>
    
    <script>
import requestAi from '@/api/requestAi'
import { set } from 'vue'
export default {
  name: 'chatBiDataBox',
  props: {
    questionId: '',
    analysis: ''
  },
  data() {
    return {
      reportText: '',
      reportLoading: true
    }
  },
  mounted() {
    if (this.analysis != '-') {
      this.reportText = this.analysis
      this.reportLoading = false
    } else {
      this.getReport()
    }
  },
  methods: {
    getReport() {
      let that = this
      that.reportLoading = true
      requestAi({ url: '/chat_bi/report', method: 'get', params: { id: that.questionId } }).then(res => {
        if (res.data) {
          that.reportText = res.data
          that.reportLoading = false
        } else {
          setTimeout(() => {
            that.getReport()
          }, 2000)
        }
      })
    }
  }
}
</script>
    
    <style>
.chatBiDataBox .changeIcon {
  font-size: 20px;
  margin-right: 5px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}
.chatBiDataBox .changeIcon.changeIconActive {
  color: rgb(38, 130, 250);
  background: #ffffff;
}
.chatBiDataBox .el-table th.el-table__cell {
  background: rgb(38, 130, 250);
  color: #ffffff;
}
</style>