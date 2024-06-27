import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";
import router from "@/router";
import request from "@/api/request";
axios.defaults.withCredentials = true;
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: {},
    userCode: "",
    breadCrumb1: "",
    breadCrumb2: "",
    globalHeight: 0,
    pathList: [
      {
        title: "首页",
        icon: "Home",
        path: "/",
        children: []
      },
      {
        title: "数据采集",
        icon: "SJCS",
        path: "/dataTransfer",
        children: [
          {
            title: "数据源管理",
            icon: "S",
            path: "/dataTransfer/dataSource",
            children: [],
            isShow: "1"
          },
          {
            title: "同步传输",
            icon: "T",
            path: "/dataTransfer/syncTasks",
            children: [],
            isShow: "1"
          },
          {
            title: "数据导入",
            icon: "S",
            path: "/dataTransfer/dataImport",
            children: [],
            isShow: "1"
          },
          {
            title: "离线任务",
            icon: "L",
            path: "/dataTransfer/offlineTasks",
            children: [],
            isShow: "1"
          },
          {
            title: "任务管理",
            icon: "R",
            path: "/dataTransfer/groupJob",
            children: [],
            isShow: "1"
          },
          {
            title: "自助分析",
            icon: "Z",
            path: "/dataTransfer/selfService",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "模型设计",
        icon: "MXSJ",
        path: "/modelDesign",
        children: [
          {
            title: "主题设计",
            icon: "Z",
            path: "/modelDesign/theme",
            children: [],
            isShow: "1"
          },
          {
            title: "分层设计",
            icon: "F",
            path: "/modelDesign/level",
            children: [],
            isShow: "1"
          },
          {
            title: "数据表",
            icon: "S",
            path: "/modelDesign/dataTable",
            children: [],
            isShow: "1"
          }
          // {
          //   title: "数据表Old",
          //   path: "/modelDesign/dataTableOld",
          //   children: [],
          //   isShow: "1"
          // }
        ]
      },
      {
        title: "运维中心",
        icon: "YWZX",
        path: "/operationCenter",
        children: [
          {
            title: "运维大盘",
            icon: "Y",
            path: "/operationCenter/operationView",
            children: [],
            isShow: "1"
          },
          {
            title: "实例运维",
            icon: "S",
            path: "/operationCenter/caseList",
            children: [],
            isShow: "1"
          }
        ]
      },

      {
        title: "API管理",
        icon: "APIGL",
        path: "/APIManage",
        children: [
          {
            title: "API集合",
            icon: "A",
            path: "/APIManage/APICollect",
            children: [],
            isShow: "1"
          },
          {
            title: "API列表",
            icon: "A",
            path: "/APIManage/APIList",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "数据质量中心",
        icon: "SJZLZX",
        path: "/dataQuality",
        children: [
          {
            title: "形态探查",
            icon: "X",
            path: "/dataQuality/tableExploration",
            children: [],
            isShow: "1"
          },
          {
            title: "规则模板",
            icon: "G",
            path: "/dataQuality/templateRule",
            children: [],
            isShow: "1"
          },
          {
            title: "质量监控",
            icon: "Z",
            path: "/dataQuality/qualityMonitor",
            children: [],
            isShow: "1"
          },
          {
            title: "数据比对",
            icon: "S",
            path: "/dataQuality/dataComparison",
            children: [],
            isShow: "1"
          },
          {
            title: "质量大屏",
            icon: "Z",
            path: "/dataQuality/qualityView",
            children: [],
            isShow: "1"
          },
          {
            title: "运行日志",
            icon: "Y",
            path: "/dataQuality/runRecord",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "指标系统",
        icon: "ZBXT",
        path: "/quotaManage",
        children: [
          {
            title: "修饰词",
            icon: "X",
            path: "/quotaManage/decorationWords",
            children: [],
            isShow: "1"
          },
          {
            title: "衍生词",
            icon: "Y",
            path: "/quotaManage/derivativeWords",
            children: [],
            isShow: "1"
          },
          {
            title: "时间周期",
            icon: "S",
            path: "/quotaManage/timeCycle",
            children: [],
            isShow: "1"
          },
          {
            title: "指标域",
            icon: "Z",
            path: "/quotaManage/quotaDomain",
            children: [],
            isShow: "1"
          },
          {
            title: "流程图测试",
            icon: "L",
            path: "/quotaCenter/graphTest",
            children: [],
            isShow: "1"
          }
        ]
      }
    ]
  },
  mutations: {}
});
