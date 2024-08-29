<template>
  <div class="manageMain manageMainNoBack dataMap">
    <p style="width: 100%; height: 40px; line-height: 40px; font-size: 18px; color: #333333; text-align: center; margin-top: 20px">数据资产地图</p>
    <div class="searchUnit">
      <div><el-input v-model="searchParam" placeholder="请输入关键字进行全局搜索"></el-input></div>
      <div><el-button type="primary">搜 索</el-button></div>
    </div>
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
        <p>数量：{{ apiCount }}</p>
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
    <div class="bottomUnit">
      <div class="bottomLeftUnit">
        <div class="titleUnit">
          <i></i>
          <p>资产目录</p>
        </div>
        <div class="contentUnit" v-loading="loadingTheme">
          <el-collapse class="themeCollapse" v-model="activeNamesTheme">
            <el-collapse-item v-for="(item, index) in dataTheme" :key="index" :name="item.topicName">
              <template slot="title"> <i class="el-icon-document-copy" style="margin-right: 20px; color: #1e69ff"></i> {{ item.topicName }}-{{ item.topicNameEn }}({{ item.childList.length }})</template>
              <p v-for="(item2, index2) in item.childList" class="themeCollapseChildUnit">{{ item2.topicName }}-{{ item2.topicNameEn }}</p>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="bottomRightUnit">
        <div class="rightTopUnit">
          <div>
            <div class="titleUnit">
              <i></i>
              <p>
                热门搜索的表
                <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
            </div>
            <div class="contentUnit" v-loading="loadingSearchTable">
              <el-empty v-if="dataSearchTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataSearchTable" :key="index">
                <p>{{ item.tableName }}</p>
                <p>{{ item.layerName }}-{{ item.topicName }}-{{ item.tableNameCn }}</p>
              </div>
            </div>
          </div>
          <div>
            <div class="titleUnit">
              <i></i>
              <p>
                近期浏览的表
                <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
            </div>
            <div class="contentUnit" v-loading="loadingViewTable">
              <el-empty v-if="dataViewTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataViewTable" :key="index">
                <p>表名</p>
                <p>表描述</p>
              </div>
            </div>
          </div>
          <div>
            <div class="titleUnit">
              <i></i>
              <p>
                近期收藏的表
                <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
            </div>
            <div class="contentUnit" v-loading="loadingCollectTable">
              <el-empty v-if="dataCollectTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataCollectTable" :key="index">
                <p>{{ item.tableName }}</p>
                <p>{{ item.collectTime }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rightBottomUnit">
          <div class="titleUnit">
            <i></i>
            <p>
              热门读取的表
              <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                <i slot="reference" class="tipIcon"></i>
              </el-popover>
            </p>
          </div>
          <div class="contentUnit">
            <el-empty description="暂无数据"></el-empty>
          </div>
        </div>
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
      },
      searchParam: '',
      apiCount: 0,
      loadingTheme: true,
      activeNamesTheme: [],
      dataTheme: [],
      loadingSearchTable: true,
      dataSearchTable: [],
      loadingViewTable: true,
      dataViewTable: [],
      loadingCollectTable: true,
      dataCollectTable: []
    }
  },
  mounted() {
    this.getApiCount()
    this.getTheme()
    this.getSearchTable()
    this.getCollectTable()
    this.getViewTable()
  },
  methods: {
    getApiCount() {
      let that = this
      request({ url: '/auto_api/list', method: 'get', params: { page: 1, pageSize: 1 } }).then(res => {
        that.apiCount = res.data.total
      })
    },
    getTheme() {
      let that = this
      that.loadingTheme = true
      that.activeNamesTheme = []
      request({ url: '/datawarehouseTopic/getTreeList', method: 'post', data: {} }).then(res => {
        that.loadingTheme = false
        that.dataTheme = res.data
        res.data.forEach(x => {
          that.activeNamesTheme.push(x.topicName)
        })
      })
    },
    getSearchTable() {
      let that = this
      that.loadingSearchTable = true
      request({ url: '/table/list_by_hot_search', method: 'get', params: {} }).then(res => {
        that.loadingSearchTable = false
        that.dataSearchTable = res.code == '200' ? res.data : []
      })
    },
    getCollectTable() {
      let that = this
      that.loadingCollectTable = true
      request({ url: '/new_table_collect/get_by_userId', method: 'get', params: {} }).then(res => {
        that.loadingCollectTable = false
        that.dataCollectTable = res.code == '200' ? res.data : []
      })
    },
    getViewTable() {
      let that = this
      that.loadingViewTable = true
      request({ url: '/table/get_recent_table_list', method: 'get', params: { userId: that.$store.state.userInfo.id } }).then(res => {
        that.loadingViewTable = false
        that.dataViewTable = res.code == '200' ? res.data : []
      })
    }
  }
}
</script>

<style >
@import '../../../assets/manage/dataMap/dataMap.css';
</style>
