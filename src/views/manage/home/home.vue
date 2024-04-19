<template>
  <div style="width: 100%; height: 100%; overflow: hidden" class="manageMain Home">
    <div class="main-unit" style="width: 100%; height: 100%; position: relative; overflow: hidden">
      <div style="width: auto; height: 30px; margin-top: 23px; margin-left: 24px; overflow: hidden">
        <p style="width: auto; height: 30px; font-size: 22px; color: #333333; line-height: 30px; float: left">操作流程</p>
        <p style="width: auto; height: 22px; font-size: 16px; color: #666666; line-height: 22px; float: left; margin-top: 6px; margin-left: 8px">6步带你玩转数据中心平台</p>
      </div>
      <div class="processMain">
        <div class="processUnit" :class="flowTimeCount > index && 'processUnitActive'" v-for="(item, index) in processList" :key="index">
          <div class="processUnitNormal">
            <i></i>
            <div>
              <p>{{ item.label }}</p>
              <p>{{ item.content }}</p>
            </div>
          </div>
          <div class="processUnitMark">
            <div>
              <p>{{ index + 1 }}</p>
              <div>
                <p>{{ item.label }}</p>
                <p>{{ item.content }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="processGap" :class="flowTimeCount > index && 'processGapActive'" :style="'left: calc(' + 16.66666 * (index + 1) + '% - 17px)'" v-for="(item, index) in 5" :key="item + '.'">
          <div class="processGapNormal">
            <i></i>
            <i></i>
            <i></i>
          </div>
          <div class="processGapMark">
            <div></div>
          </div>
        </div>
      </div>
      <div style="width: calc(100% - 48px); height: 1px; background: #ececec; margin: 30px auto 0 auto"></div>

      <img src="../../../assets/manage/home.gif" alt="" style="height: calc(100% - 240px); margin: 10px auto; display: block" />
    </div>
  </div>
</template>

<script>
import { resetForm, Notify } from '@/api/common'
import request from '@/api/request'
export default {
  name: 'home',
  data() {
    return {
      processList: [
        {
          label: '需求输入',
          content: '梳理指标需求，并在指标系统完成指标维护'
        },
        {
          label: '数据准备',
          content: '使用数据传输 、 数据测试中心 接入和测试数据'
        },
        {
          label: '模型设计',
          content: '在模型设计中心 完成数仓、数据模型的设计'
        },
        {
          label: '模型开发',
          content: '通过自助分析 、 离线开发完成数据探查、开发'
        },
        {
          label: '质量控制',
          content: '结合数据质量中心实现对产出数据的质量控制'
        },
        {
          label: '需求交付',
          content: '通过数据服务 API完成最终数据需求的输出'
        }
      ],
      flowInterval: null,
      flowTimeCount: 0
    }
  },
  mounted() {
    this.setFlowInterval()
  },
  destroyed() {
    let that = this
    clearInterval(that.flowInterval)
  },
  methods: {
    setFlowInterval() {
      let that = this
      clearInterval(that.flowInterval)
      that.flowInterval = setInterval(function () {
        that.flowTimeCount += 1
        if (that.flowTimeCount == 7) {
          that.flowTimeCount = 0
        }
      }, 2000)
    }
  }
}
</script>

<style scoped>
</style>
