<template>
  <div style="width: 300px; height: auto; border-radius: 4px; overflow: hidden; border: 1px solid #909399">
    <div style="width: 300px; height: 36px; background: #ffffff; overflow: hidden">
      <p style="width: 300px; height: 36px; line-height: 36px; text-align: center; font-size: 14px; color: #606266; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">开始</p>
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
      node: {}
    }
  },
  mounted() {
    this.node = this.getNode()
    let width = 300
    let height = 40
    this.node.prop('size', { width, height })
    console.log(this.node)
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
