<template>
  <div style="width: 300px; height: auto; border-radius: 4px; overflow: hidden" :style="rowData.taskType == 'sync' ? 'border: 1px solid #409eff' : rowData.taskType == 'sql' ? 'border: 1px solid #67c23a' : 'border: 1px solid #E6A23C'">
    <div style="width: 300px; height: 36px; background: #ffffff; overflow: hidden">
      <p v-if="rowData.taskType == 'sync'" style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #409eff; float: left">传输</p>
      <p v-if="rowData.taskType == 'sql'" style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #67c23a; float: left">SQL</p>
      <p v-if="rowData.taskType == 'monitor'" style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #e6a23c; float: left">监控</p>
      <p v-if="rowData.taskType == 'detect'" style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #e6a23c; float: left">探查</p>
      <p v-if="rowData.taskType == 'compare'" style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #e6a23c; float: left">比对</p>
      <p :title="rowData.taskName" style="width: 230px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        {{ rowData.taskName }}
      </p>
    </div>
  </div>
</template>

<script>
import request from '@/api/request'
export default {
  name: 'Node',
  inject: ['getGraph', 'getNode'],
  props: {
    // item: {},
  },
  data() {
    return {
      node: {},
      rowData: {},
      columnsData: []
    }
  },
  mounted() {
    this.node = this.getNode()
    let width = 300
    let height = 40
    this.node.prop('size', { width, height })
    console.log(this.node)
    this.rowData = this.node.store.data.data

    // 监听数据改变事件
    this.node.on('change:data', ({ current }) => {
      console.log('----,', current)
    })
  },
  methods: {}
}
</script>
<style  scoped>
</style>
