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
        adminInfo: false,
        icon: "Home",
        isShow: "1",
        path: "/",
        children: []
      },
      {
        title: "消息中心",
        adminInfo: false,
        icon: "xxzx",
        isShow: "0",
        path: "/messageCenter",
        children: []
      },
      {
        title: "数据建模",
        adminInfo: false,
        icon: "sjjm",
        isShow: "1",
        path: "/dataModeling",
        children: [
          {
            title: "分层设计",
            icon: "fcsj",
            path: "/dataModeling/level",
            children: [],
            isShow: "1"
          },
          {
            title: "主题设计",
            icon: "ztsj",
            path: "/dataModeling/theme",
            children: [],
            isShow: "1"
          },

          {
            title: "数据表",
            icon: "sjb",
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
        adminInfo: false,
        icon: "sjjc",
        isShow: "1",
        path: "/dataIntegration",
        children: [
          {
            title: "数据源管理",
            icon: "sjygl",
            path: "/dataIntegration/dataSource",
            children: [],
            isShow: "1"
          },
          {
            title: "数据同步",
            icon: "sjtb",
            path: "/dataIntegration/syncTasks",
            children: [],
            isShow: "1"
          },
          {
            title: "本地导入",
            icon: "bddr",
            path: "/dataIntegration/dataImport",
            children: [],
            isShow: "1"
          },

          {
            title: "任务管理",
            icon: "rwgl",
            path: "/dataIntegration/groupJob",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "数据开发",
        adminInfo: false,
        icon: "sjkf",
        isShow: "1",
        path: "/dataDevelop",
        children: [
          {
            title: "离线开发",
            icon: "lxkf",
            path: "/dataDevelop/offlineTasks",
            children: [],
            isShow: "1"
          },

          {
            title: "自助分析",
            icon: "zzfx",
            path: "/dataDevelop/selfService",
            children: [],
            isShow: "1"
          },
          {
            title: "函数中心",
            icon: "hszx",
            path: "/dataDevelop/udfStudio",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "质量中心",
        adminInfo: false,
        icon: "zlzx",
        isShow: "1",
        path: "/dataQuality",
        children: [
          {
            title: "质量大屏",
            icon: "zldp",
            path: "/dataQuality/qualityView",
            children: [],
            isShow: "1"
          },

          {
            title: "规则模板",
            icon: "gzmb",
            path: "/dataQuality/templateRule",
            children: [],
            isShow: "1"
          },
          {
            title: "质量监控",
            icon: "zljk",
            path: "/dataQuality/qualityMonitor",
            children: [],
            isShow: "1"
          },
          {
            title: "形态探查",
            icon: "xttc",
            path: "/dataQuality/tableExploration",
            children: [],
            isShow: "1"
          },
          {
            title: "数据比对",
            icon: "sjbd",
            path: "/dataQuality/dataComparison",
            children: [],
            isShow: "1"
          },

          {
            title: "运行日志",
            icon: "yxrz",
            path: "/dataQuality/runRecord",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "运维中心",
        adminInfo: false,
        icon: "ywzx",
        isShow: "1",
        path: "/operationCenter",
        children: [
          {
            title: "运维大盘",
            icon: "ywdp",
            path: "/operationCenter/operationView",
            children: [],
            isShow: "1"
          },
          {
            title: "实例运维",
            icon: "slyw",
            path: "/operationCenter/caseList",
            children: [],
            isShow: "1"
          },
          {
            title: "平台管理",
            icon: "ptgl",
            path: "/operationCenter/platformManage",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "资产中心",
        adminInfo: false,
        icon: "zczx",
        isShow: "1",
        path: "/propertyCenter",
        children: [
          {
            title: "数据地图",
            icon: "sjdt",
            path: "/propertyCenter/dataMap",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "API管理",
        adminInfo: false,
        icon: "apigl",
        isShow: "1",
        path: "/APIManage",
        children: [
          {
            title: "API集合",
            icon: "apijh",
            path: "/APIManage/APICollect",
            children: [],
            isShow: "1"
          },
          {
            title: "API列表",
            icon: "apilb",
            path: "/APIManage/APIList",
            children: [],
            isShow: "1"
          },
          {
            title: "API审核",
            icon: "",
            path: "/APIManage/APIExamine",
            children: [],
            isShow: "0"
          }
        ]
      },
      {
        title: "权限中心",
        icon: "qxzx",
        adminInfo: true,
        isShow: "1",
        path: "/powerCenter",
        children: [
          {
            title: "项目组管理",
            icon: "xmzgl",
            path: "/powerCenter/teamManage",
            children: [],
            isShow: "1"
          },
          {
            title: "项目管理",
            icon: "xmgl",
            path: "/powerCenter/projectManage",
            children: [],
            isShow: "1"
          },
          {
            title: "角色管理",
            icon: "jsgl",
            path: "/powerCenter/roleManage",
            children: [],
            isShow: "1"
          },
          {
            title: "用户管理",
            icon: "yhgl",
            path: "/powerCenter/userManage",
            children: [],
            isShow: "1"
          },
          {
            title: "权限申请",
            icon: "qxsq",
            path: "/powerCenter/permissionApplication",
            children: [],
            isShow: "1"
          },
          {
            title: "审批管理",
            icon: "spgl",
            path: "/powerCenter/approveManage",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "安全中心",
        icon: "aqzx",
        adminInfo: false,
        isShow: "1",
        path: "/securityCenter",
        children: [
          {
            title: "数据安全等级",
            icon: "sjaqdj",
            path: "/securityCenter/dataSecurityLevel",
            children: [],
            isShow: "1"
          },
          {
            title: "数据脱敏",
            icon: "sjtm",
            path: "/securityCenter/dataDesensitization",
            children: [],
            isShow: "1"
          },
          {
            title: "脱敏规则",
            icon: "tmgz",
            path: "/securityCenter/desensitizationRule",
            children: [],
            isShow: "1"
          },
          {
            title: "敏感类型",
            icon: "mglx",
            path: "/securityCenter/sensitiveType",
            children: [],
            isShow: "1"
          },
          {
            title: "操作审计",
            icon: "czsj",
            path: "/securityCenter/operationalAudit",
            children: [],
            isShow: "1"
          }
        ]
      },
      {
        title: "指标系统",
        icon: "zbxt",
        adminInfo: false,
        isShow: "1",
        path: "/quotaManage",
        children: [
          {
            title: "修饰词",
            icon: "xsc",
            path: "/quotaManage/decorationWords",
            children: [],
            isShow: "1"
          },
          {
            title: "衍生词",
            icon: "ysc",
            path: "/quotaManage/derivativeWords",
            children: [],
            isShow: "1"
          },
          {
            title: "时间周期",
            icon: "sjzq",
            path: "/quotaManage/timeCycle",
            children: [],
            isShow: "1"
          },
          {
            title: "指标域",
            icon: "zby",
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
    sortPathList: [],
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
