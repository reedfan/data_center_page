<template>
  <el-pagination class="el-pagination" @current-change="handlePageChange" @size-change="handleSizeChange" :page-size="pageSize" :current-page="pageNum" layout="total, sizes, prev, pager, next, jumper" v-bind="$attrs" v-on="$listeners" :total="total"> </el-pagination>
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
    },
    handleSizeChange(size) {
      this.$emit('update:pageNum', 1)
      this.$emit('update:pageSize', size)
      // 重新获取数据
      this.getTableData()
    }
  }
}
</script>

<style scoped>
.el-pagination {
  text-align: right;
  margin-top: 10px;
  margin-right: 20px;
  padding-bottom: 10px;
}
.el-pagination .el-input__inner {
  border-radius: 1px;
  border: 1px solid #eaeaea;
  height: 28px;
  line-height: 28px;
  color: #606266;
  font-size: 12px;
}
</style>

