<template>
  <div class="manageMain manageMainNoBack dataMap">
    <p style="width: 100%; height: 40px; line-height: 40px; font-size: 18px; color: #333333; text-align: center; margin-top: 20px">数据资产地图</p>
    <div class="TopUnit">
      <div>
        <div><i></i></div>
        <p>
          表
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>已治理：54</p>
        <p>未治理：11154</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          指标
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：493</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          标签
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：25</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          API
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：73</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          业务对象
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：3</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          专辑
          <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>公开：43</p>
        <p>私有：13</p>
      </div>
    </div>
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
@import '../../../assets/manage/dataMap/dataMap.css';
</style>
