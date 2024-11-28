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
          <el-popover placement="top-start" title="" width="200" trigger="hover">
            <div>
              1、在平台上经过元数据治理和发布后的表，为已治理的表，这类表的详情页会有“已治理”标签。没有经过治理发布的表，则均为未治理表。<br />
              2、这里统计的是表总数，包括私有表和模型未暴露分层的表。<br />
              3、统计非实时更新，默认展示昨日数据。<br />
            </div>
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
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="在指标系统中经过发布审核的指标，统计非实时更新，默认展示昨日数据。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：493</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          标签
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="在标签画像中经过发布审核的标签，统计非实时更新，默认展示昨日数据。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：25</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          API
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="已发布到API市场的API，统计非实时更新，默认展示昨日数据。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：{{ apiCount }}</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          业务对象
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="统计关系建模中已上线的业务对象数量，统计非实时更新，默认展示昨日数据。">
            <i slot="reference" class="tipIcon"></i>
          </el-popover>
        </p>
        <p>数量：3</p>
      </div>
      <div>
        <div><i></i></div>
        <p>
          专辑
          <el-popover placement="top-start" title="" width="200" trigger="hover" content="当前项目组下所有创建的公开或私有的专辑，统计非实时更新，默认展示昨日数据。">
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
                <el-popover placement="top-start" title="" width="200" trigger="hover" content="实时统计历史搜索总次数排名前5的表。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
            </div>
            <div class="contentUnit" v-loading="loadingSearchTable">
              <el-empty v-if="dataSearchTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataSearchTable" :key="index" @click="gotoTableDetail(item.id, item.dataSourceId, item.tableName)">
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
                <el-popover placement="top-start" title="" width="200" trigger="hover" content="实时统计最近浏览的表，且按照浏览时间倒序展示。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
            </div>
            <div class="contentUnit" v-loading="loadingViewTable">
              <el-empty v-if="dataViewTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataViewTable" :key="index" @click="gotoTableDetail(item.tableId, item.dataSourceId, item.tableName)">
                <p>{{ item.tableName }}</p>
                <p>{{ item.date }}</p>
              </div>
            </div>
          </div>
          <div>
            <div class="titleUnit">
              <i></i>
              <p>
                近期收藏的表
                <el-popover placement="top-start" title="" width="200" trigger="hover" content="实时统计最近收藏的表，且按照收藏时间倒序展示。">
                  <i slot="reference" class="tipIcon"></i>
                </el-popover>
              </p>
              <p @click="showAllCollectTable()">更多</p>
            </div>
            <div class="contentUnit" v-loading="loadingCollectTable">
              <el-empty v-if="dataCollectTable.length == 0" description="暂无数据"></el-empty>

              <div class="tableUnit" v-for="(item, index) in dataCollectTable" :key="index" @click="gotoTableDetail(item.tableId, item.dataSourceId, item.tableName)">
                <p>{{ item.tableName }}</p>
                <p>{{ item.date }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="rightBottomUnit">
          <div class="titleUnit">
            <i></i>
            <p>
              热门读取的表
              <el-popover placement="top-start" title="" width="200" trigger="hover" content="统计近7天读取总次数排名12的表，统计时间截止昨日。">
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
    <el-dialog title="所有收藏的表" :visible.sync="dialogShowAllCollectTable" width="800px">
      <el-table v-loading="loadingAllCollectTable" element-loading-text="数据加载中" ref="table" :data="dataAllCollectTable" max-height="500">
        <el-table-column type="index" label="序号" align="center" width="60"> </el-table-column>
        <el-table-column prop="tableName" label="表名称" min-width="160" align="left"> </el-table-column>
        <el-table-column prop="date" label="收藏时间" min-width="150" align="left"> </el-table-column>
        <el-table-column label="操作" align="center" width="80" fixed="right">
          <template slot-scope="scope">
            <p class="tableAction" @click="gotoTableDetail(scope.row.tableId, scope.row.dataSourceId, scope.row.tableName)">详情</p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
      dataCollectTable: [],

      dialogShowAllCollectTable: false,
      dataAllCollectTable: [],
      loadingAllCollectTable: false
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
        that.dataSearchTable = res.code == '200' ? res.data.slice(0, 5) : []
      })
    },
    getCollectTable() {
      let that = this
      that.loadingCollectTable = true
      request({ url: '/table/get_collect_table_list ', method: 'get', params: {} }).then(res => {
        that.loadingCollectTable = false
        that.dataCollectTable = res.code == '200' ? res.data.slice(0, 5) : []
        that.dataCollectTable.forEach(x => {
          x.date = dateFormat('YYYY-mm-dd HH:MM:SS', x.score)
        })
      })
    },
    showAllCollectTable() {
      let that = this
      that.dialogShowAllCollectTable = true
      that.loadingAllCollectTable = true
      request({ url: '/table/get_collect_table_list ', method: 'get', params: {} }).then(res => {
        that.loadingAllCollectTable = false
        that.dataAllCollectTable = res.code == '200' ? res.data : []
        that.dataAllCollectTable.forEach(x => {
          x.date = dateFormat('YYYY-mm-dd HH:MM:SS', x.score)
        })
      })
    },
    getViewTable() {
      let that = this
      that.loadingViewTable = true
      request({ url: '/table/get_recent_table_list', method: 'get', params: {} }).then(res => {
        that.loadingViewTable = false
        that.dataViewTable = res.code == '200' ? res.data : []
        that.dataViewTable.forEach(x => {
          x.date = dateFormat('YYYY-mm-dd HH:MM:SS', x.score)
        })
      })
    },
    // 跳转表详情
    gotoTableDetail(tableId, dataSourceId, tableName) {
      window.open(window.location.href.substring(0, window.location.href.length - this.$route.path.length) + '/tableDetail?id=' + tableId + '&dataSourceId=' + dataSourceId + '&tableName=' + tableName + '&userInfoId=' + this.$store.state.userInfo.id)
    }
  }
}
</script>

<style >
@import '../../../assets/manage/dataMap/dataMap.css';
</style>
