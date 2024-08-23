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
        title: "数据建模",
        icon: "MXSJ",
        path: "/dataModeling",
        children: [
          {
            title: "分层设计",
            icon: "F",
            path: "/dataModeling/level",
            children: [],
            isShow: "1"
          },
          {
            title: "主题设计",
            icon: "Z",
            path: "/dataModeling/theme",
            children: [],
            isShow: "1"
          },

          {
            title: "数据表",
            icon: "S",
            path: "/dataModeling/dataTable",
            children: [],
            isShow: "1"
          }
          // {
          //   title: "数据表Old",
          //   path: "/dataModeling/dataTableOld",
          //   children: [],
          //   isShow: "1"
          // }
        ]
      },
      {
        title: "数据集成",
        icon: "SJCS",
        path: "/dataIntegration",
        children: [
          {
            title: "数据源管理",
            icon: "S",
            path: "/dataIntegration/dataSource",
            children: [],
            isShow: "1"
          },
          {
            title: "数据同步",
            icon: "T",
            path: "/dataIntegration/syncTasks",
            children: [],
            isShow: "1"
          },
          {
            title: "本地导入",
            icon: "S",
            path: "/dataIntegration/dataImport",
            children: [],
            isShow: "1"
          },

          {
            title: "任务管理",
            icon: "R",
            path: "/dataIntegration/groupJob",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "数据开发",
        icon: "SJKF",
        path: "/dataDevelop",
        children: [
          {
            title: "离线开发",
            icon: "L",
            path: "/dataDevelop/offlineTasks",
            children: [],
            isShow: "1"
          },

          {
            title: "自助分析",
            icon: "Z",
            path: "/dataDevelop/selfService",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "质量中心",
        icon: "ZLZX",
        path: "/dataQuality",
        children: [
          {
            title: "质量大屏",
            icon: "Z",
            path: "/dataQuality/qualityView",
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
            title: "形态探查",
            icon: "X",
            path: "/dataQuality/tableExploration",
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
            title: "运行日志",
            icon: "Y",
            path: "/dataQuality/runRecord",
            children: [],
            isShow: "1"
          }
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
          },
          {
            title: "平台管理",
            icon: "S",
            path: "/operationCenter/platformManage",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "资产中心",
        icon: "zczx",
        path: "/propertyCenter",
        children: [
          {
            title: "数据地图",
            icon: "S",
            path: "/propertyCenter/dataMap",
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
        title: "权限中心",
        icon: "qxzx",
        path: "/powerCenter",
        children: [
          {
            title: "项目组管理",
            icon: "A",
            path: "/powerCenter/teamManage",
            children: [],
            isShow: "1"
          },
          {
            title: "项目管理",
            icon: "A",
            path: "/powerCenter/projectManage",
            children: [],
            isShow: "1"
          },
          {
            title: "角色管理",
            icon: "A",
            path: "/powerCenter/roleManage",
            children: [],
            isShow: "1"
          },
          {
            title: "用户管理",
            icon: "A",
            path: "/powerCenter/userManage",
            children: [],
            isShow: "1"
          },
          {
            title: "权限申请",
            icon: "A",
            path: "/powerCenter/permissionApplication",
            children: [],
            isShow: "1"
          },
          {
            title: "审批管理",
            icon: "A",
            path: "/powerCenter/approveManage",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "安全中心",
        icon: "aqzx",
        path: "/securityCenter",
        children: [
          {
            title: "数据安全等级",
            icon: "A",
            path: "/securityCenter/dataSecurityLevel",
            children: [],
            isShow: "1"
          },
          {
            title: "数据脱敏",
            icon: "A",
            path: "/securityCenter/dataDesensitization",
            children: [],
            isShow: "1"
          },
          {
            title: "脱敏规则",
            icon: "A",
            path: "/securityCenter/desensitizationRule",
            children: [],
            isShow: "1"
          },
          {
            title: "敏感类型",
            icon: "A",
            path: "/securityCenter/sensitiveType",
            children: [],
            isShow: "1"
          },
          {
            title: "操作审计",
            icon: "A",
            path: "/securityCenter/operationalAudit",
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
          }
          // {
          //   title: "流程图测试",
          //   icon: "L",
          //   path: "/quotaCenter/graphTest",
          //   children: [],
          //   isShow: "1"
          // }
        ]
      }
    ],
    activeTopRoute: "",
    pathListLeft: {
      title: "首页",
      icon: "Home",
      path: "/",
      children: []
    }
  },
  mutations: {}
});
