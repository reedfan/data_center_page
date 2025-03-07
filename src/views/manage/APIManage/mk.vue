<template>
  <div class="manageMain APIDocument">
    <v-md-editor v-model="markdownContent" style="height: calc(100% - 40px); margin-top: 20px" mode="editable"></v-md-editor>
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
  mounted() {},
  methods: {}
}
</script>

<style scoped>
</style>
