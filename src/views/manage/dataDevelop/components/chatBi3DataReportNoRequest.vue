<template>
  <div style="width: 880px; height: auto; overflow: hidden; position: relative; margin-top: 20px" class="chatBiDataBox">
    <div style="width: 878px; transition: 0.3s; height: auto; overflow: hidden auto; background: #ffffff; position: relative">
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
      reportText: ''
    }
  },
  mounted() {
    this.reportText = this.analysis
  },
  methods: {}
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