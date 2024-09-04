<template>
  <div style="width: 300px; height: auto; border-radius: 2px; overflow: hidden">
    <p v-if="itemData.type == 'master'" style="background: #409eff; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">主节点</p>
    <p v-if="itemData.type == 'prev'" style="background: #606266; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">上游节点</p>
    <p v-if="itemData.type == 'next'" style="background: #606266; width: 300px; height: 30px; line-height: 30px; text-align: left; text-indent: 10px; font-size: 12px; color: #ffffff">下游节点</p>
    <div v-if="itemData.type == 'master'" style="width: 300px; height: 40px; background: #ffffff; overflow: hidden; border-bottom: 1px solid #e4e6eb">
      <i class="el-icon-coin" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
      <p :title="itemData.tableName" style="width: 230px; height: 40px; line-height: 40px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
        {{ itemData.tableName }}
      </p>
    </div>
    <div v-if="itemData.type == 'prev'" style="width: 300px; height: auto; background: #ffffff; overflow: hidden">
      <div v-for="(item, index) in itemData.tableNames" :key="index" style="width: 300px; height: 40px; background: #ffffff; overflow: hidden; border-bottom: 1px solid #e4e6eb">
        <i class="el-icon-coin" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
        <p :title="item.tableName" style="width: 230px; height: 40px; line-height: 40px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
          {{ item.tableName }}
        </p>
      </div>
    </div>
    <div v-if="itemData.type == 'next'" style="width: 300px; height: auto; background: #ffffff; overflow: hidden">
      <div v-for="(item, index) in itemData.tableNames" :key="index" style="width: 300px; height: 40px; background: #ffffff; overflow: hidden; border-bottom: 1px solid #e4e6eb">
        <i class="el-icon-coin" style="font-size: 16px; color: #606266; display: block; float: left; margin-top: 10px; margin-left: 10px"></i>
        <p :title="item.tableName" style="width: 230px; height: 40px; line-height: 40px; font-size: 14px; color: #606266; float: left; margin-left: 5px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis">
          {{ item.tableName }}
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
