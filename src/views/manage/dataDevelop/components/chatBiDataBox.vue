<template>
  <div style="width: 100%; height: auto; overflow: hidden auto; background: #ffffff; position: relative">
    <el-table ref="table" :data="boxData" height="500">
      <el-table-column type="index" label="序号" align="center" width="59"> </el-table-column>
      <el-table-column :prop="item" :label="item" min-width="267" align="center" v-for="(item, index) in Object.keys(boxData[0])" :key="index">
        <template slot-scope="scope">
          {{ scope.row[item] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
    
    <script>
export default {
  name: 'chatBiDataBox',
  props: {
    boxData: {}
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.boxData)
  }
}
</script>
    
    <style>
</style>