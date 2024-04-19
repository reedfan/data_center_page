<template>
  <div style="width: 300px; height: auto; border-top: 4px solid #409eff; border-radius: 2px; overflow: hidden">
    <div style="width: 300px; height: 36px; background: #ffffff; overflow: hidden">
      <i class="el-icon-document-copy" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
      <p style="width: 230px; height: 36px; line-height: 36px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        {{ itemData.tableName }}
      </p>
      <i class="el-icon-arrow-up" v-if="detailShow" @click.stop="hideDetail()" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px; cursor: pointer"></i>
      <i class="el-icon-arrow-down" v-if="!detailShow" @click.stop="showDetail()" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px; cursor: pointer"></i>
    </div>
    <div v-if="detailShow" style="width: 300px; height: auto; overflow: hidden auto; background: rgba(228, 230, 235, 0.5)">
      <div v-for="(item, index) in columnsData" :key="index" style="width: 300px; height: 30px; overflow: hidden">
        <p style="width: 90px; height: 30px; line-height: 30px; font-size: 12px; color: #409eff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; float: left; margin-left: 20px">{{ item.columnType }}</p>
        <p style="width: 160px; height: 30px; line-height: 30px; font-size: 14px; color: #409eff; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; float: left; margin-left: 20px">{{ item.columnName }}</p>
      </div>
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
      itemData: {},
      columnsData: [],
      detailShow: false
    }
  },
  mounted() {
    this.node = this.getNode()
    let width = 300
    let height = 40
    this.node.prop('size', { width, height })
    console.log(this.node)
    this.itemData = this.node.store.data.data
    this.getColumns()
    // 监听数据改变事件
    this.node.on('change:data', ({ current }) => {
      console.log('----,', current)
    })
  },
  methods: {
    getColumns() {
      let that = this
      request({ url: '/data_source/columns', method: 'get', params: { id: that.itemData.dataSourceId, table: that.itemData.tableName } }).then(res => {
        that.columnsData = res.data || []
      })
    },
    showDetail() {
      let that = this
      that.detailShow = true
      let width = 300
      let height = 40 + that.columnsData.length * 30
      that.node.prop('size', { width, height })
    },
    hideDetail() {
      let that = this
      that.detailShow = false
      let width = 300
      let height = 40
      that.node.prop('size', { width, height })
    }
  }
}
</script>
<style  scoped>
</style>
