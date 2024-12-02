<template>
  <div class="manageMain APIDocument">
    <v-md-editor v-model="markdownContent" style="height: calc(100% - 40px); margin-top: 20px" mode="preview"></v-md-editor>
  </div>
</template>

<script>
import { resetForm, Notify, copyText } from '@/api/common'
import request from '@/api/request'
import * as monaco from 'monaco-editor'
export default {
  name: 'APIDocument',

  data() {
    return {
      markdownContent: ''
    }
  },
  mounted() {
    this.getMarkdownContent()
  },
  methods: {
    // 获取文档
    getMarkdownContent() {
      let that = this
      request({ url: '/remote_api_instruction/get', method: 'get', params: { id: 1 } }).then(res => {
        that.markdownContent = res.data.instruction
      })
    }
  }
}
</script>

<style scoped>
</style>
