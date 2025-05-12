<template>
  <div style="width: 300px; height: auto; border-radius: 4px; overflow: hidden; border: 1px solid #f56c6c">
    <div style="width: 300px; height: 36px; background: #ffffff; overflow: hidden">
      <p style="width: 40px; color: #ffffff; height: 20px; line-height: 20px; margin: 8px 5px 8px 10px; text-align: center; font-size: 14px; border-radius: 2px; background: #f56c6c; float: left">嵌套</p>
      <p :title="rowData.nodeName" style="width: 230px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        {{ rowData.nodeName }}
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
      this.rowData = this.node.store.data.data
    })
  },
  methods: {}
}
</script>
<style  scoped>
</style>
