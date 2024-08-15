<template>
  <div class="manageMain">
    <p>数据脱敏</p>
  </div>
</template>

<script>
import { resetForm, Notify, copyText, dateFormat } from '@/api/common'
import request from '@/api/request'

export default {
  name: 'dataMap',

  data() {
    return {
      empty: '',
      rules: {
        test: []
      }
    }
  },
  mounted() {},
  methods: {}
}
</script>

<style scoped>
</style>
