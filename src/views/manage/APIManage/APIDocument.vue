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
      markdownContent: '```java \n' + 'public void static main (String[] args){\n\n\n}\n' + '```'
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
</style>
