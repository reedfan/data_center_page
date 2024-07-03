<template>
  <div style="width: 300px; height: auto; border-radius: 2px; overflow: hidden">
    <p v-if="itemData.type == 'master'" style="background: #409eff; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">主节点</p>
    <p v-if="itemData.type == 'prev'" style="background: #606266; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">上游节点</p>
    <p v-if="itemData.type == 'next'" style="background: #606266; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">下游节点</p>
    <div style="width: 300px; height: auto" v-for="(item, index) in itemData.fieldsArr" :key="index">
      <div style="width: 300px; height: 40px; background: rgb(242, 235, 235); overflow: hidden; border-bottom: 1px solid #e4e6eb">
        <i class="el-icon-coin" style="font-size: 20px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
        <p :title="item.name" style="width: 230px; height: 40px; line-height: 40px; font-size: 16px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
          {{ item.name }}
        </p>
      </div>

      <div v-for="(item2, index2) in item.fields" :key="index2" style="width: 300px; height: 40px; background: #ffffff; overflow: hidden; border-bottom: 1px solid #e4e6eb">
        <i class="el-icon-c-scale-to-original" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 12px; margin-left: 20px"></i>
        <p style="width: 210px; height: 40px; line-height: 40px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
          {{ item2 }}
        </p>
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
    this.itemData = this.node.store.data.data
  },
  methods: {}
}
</script>
<style  scoped>
</style>
