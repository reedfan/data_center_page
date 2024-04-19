<template>
  <el-pagination class="el-pagination" @current-change="handlePageChange" background :page-size="pageSize" :current-page="pageNum" layout="total, prev, pager, next, jumper" v-bind="$attrs" v-on="$listeners" :total="total"> </el-pagination>
</template>

<script>
export default {
  name: 'Pagination',

  props: {
    // 每页数量
    pageSize: {
      type: Number,
      default: 15
    },

    // 第几页
    pageNum: {
      type: Number,
      default: 1
    },

    // 数量总数
    total: {
      type: Number,
      default: 0
    },

    // 获取数量的方法
    getTableData: {
      type: Function,
      default: () => {}
    }
  },

  methods: {
    // 切换页面
    handlePageChange(num) {
      this.$emit('update:pageNum', num)
      // 重新获取数据
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.el-pagination {
  text-align: center;
  margin-top: 30px;
}
</style>
<style>
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1f6f66;
  color: #fff;
}
</style>
