import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login/login")
    },
    {
      path: "/tableDetail",
      name: "tableDetail",
      component: () => import("@/views/manage/dataModeling/tableDetail")
    },
    {
      path: "/",
      name: "index",
      component: () => import("@/views/index"),
      children: [
        {
          path: "/",
          name: "manage",
          component: () => import("@/views/manage/manage"),
          children: [
            {
              // 首页
              path: "/",
              name: "home",
              component: () => import("@/views/manage/home/home"),
              children: []
            },
            {
              // 消息中心
              path: "/userCenter/messageCenter",
              name: "messageCenter",
              component: () =>
                import("@/views/manage/userCenter/messageCenter"),
              children: []
            },
            {
              // 个人信息
              path: "/userCenter/userInfo",
              name: "userInfo",
              component: () => import("@/views/manage/userCenter/userInfo"),
              children: []
            },
            {
              // 数据集成-数据源管理
              path: "/dataIntegration/dataSource",
              name: "dataSource",
              component: () =>
                import("@/views/manage/dataIntegration/dataSource"),
              children: []
            },
            {
              //  数据集成-数据同步
              path: "/dataIntegration/syncTasks",
              name: "syncTasks",
              component: () =>
                import("@/views/manage/dataIntegration/syncTasks"),
              children: []
            },
            {
              //  数据集成-本地导入
              path: "/dataIntegration/dataImport",
              name: "dataImport",
              component: () =>
                import("@/views/manage/dataIntegration/dataImport"),
              children: []
            },

            {
              //  数据集成-任务管理
              path: "/dataIntegration/groupJobOld",
              name: "groupJobOld",
              component: () =>
                import("@/views/manage/dataIntegration/groupJobOld"),
              children: []
            },
            {
              //  数据集成-任务管理
              path: "/dataIntegration/groupJob",
              name: "groupJob",
              component: () =>
                import("@/views/manage/dataIntegration/groupJob"),
              children: []
            },

            {
              //  数据开发-离线开发
              path: "/dataDevelop/offlineTasks",
              name: "offlineTasks",
              component: () =>
                import("@/views/manage/dataDevelop/offlineTasks"),
              children: []
            },
            {
              //  数据开发-自助分析
              path: "/dataDevelop/selfService",
              name: "selfService",
              component: () => import("@/views/manage/dataDevelop/selfService"),
              children: []
            },
            {
              //  数据开发-函数中心
              path: "/dataDevelop/udfStudio",
              name: "udfStudio",
              component: () => import("@/views/manage/dataDevelop/udfStudio"),
              children: []
            },
            {
              //  数据开发-spark日志
              path: "/dataDevelop/sparkRecord",
              name: "sparkRecord",
              component: () => import("@/views/manage/dataDevelop/sparkRecord"),
              children: []
            },
            {
              //  数据开发-chatBi
              path: "/dataDevelop/chatBi",
              name: "chatBi",
              component: () => import("@/views/manage/dataDevelop/chatBi"),
              children: []
            },

            {
              //  运维中心-运维大盘
              path: "/operationCenter/operationView",
              name: "operationView",
              component: () =>
                import("@/views/manage/operationCenter/operationView"),
              children: []
            },
            {
              //  运维中心-实例运维
              path: "/operationCenter/caseList",
              name: "caseList",
              component: () =>
                import("@/views/manage/operationCenter/caseList"),
              children: []
            },
            {
              //  运维中心-平台管理
              path: "/operationCenter/platformManage",
              name: "platformManage",
              component: () =>
                import("@/views/manage/operationCenter/platformManage"),
              children: []
            },
            {
              // 数据建模-主题设计
              path: "/dataModeling/theme",
              name: "theme",
              component: () => import("@/views/manage/dataModeling/theme"),
              children: []
            },
            {
              //  数据建模-分层设计
              path: "/dataModeling/level",
              name: "level",
              component: () => import("@/views/manage/dataModeling/level"),
              children: []
            },
            {
              //  数据建模-标准字典
              path: "/dataModeling/standardDictionary",
              name: "standardDictionary",
              component: () =>
                import("@/views/manage/dataModeling/standardDictionary"),
              children: []
            },
            {
              //  数据建模-原始字典
              path: "/dataModeling/originalDictionary",
              name: "originalDictionary",
              component: () =>
                import("@/views/manage/dataModeling/originalDictionary"),
              children: []
            },
            {
              //  数据建模-数据表
              path: "/dataModeling/dataTable",
              name: "dataTable",
              component: () => import("@/views/manage/dataModeling/dataTable"),
              children: []
            },
            {
              //  数据建模-数据表Old
              path: "/dataModeling/dataTableOld",
              name: "dataTableOld",
              component: () =>
                import("@/views/manage/dataModeling/dataTableOld"),
              children: []
            },
            {
              //  资产中心-数据地图
              path: "/propertyCenter/dataMap",
              name: "dataMap",
              component: () => import("@/views/manage/propertyCenter/dataMap"),
              children: []
            },
            {
              //  API管理-API集合
              path: "/APIManage/APICollect",
              name: "APICollect",
              component: () => import("@/views/manage/APIManage/APICollect"),
              children: []
            },
            {
              //  API管理-API列表
              path: "/APIManage/APIList",
              name: "APIList",
              component: () => import("@/views/manage/APIManage/APIList"),
              children: []
            },
            {
              //  API管理-API文档
              path: "/APIManage/APIDocument",
              name: "APIDocument",
              component: () => import("@/views/manage/APIManage/APIDocument"),
              children: []
            },
            {
              //  API管理-编写markdown
              path: "/APIManage/mk",
              name: "mk",
              component: () => import("@/views/manage/APIManage/mk"),
              children: []
            },

            {
              //  数据质量中心-形态探查
              path: "/dataQuality/tableExploration",
              name: "tableExploration",
              component: () =>
                import("@/views/manage/dataQuality/tableExploration"),
              children: []
            },
            {
              //  数据质量中心-规则模板
              path: "/dataQuality/templateRule",
              name: "templateRule",
              component: () =>
                import("@/views/manage/dataQuality/templateRule"),
              children: []
            },
            {
              //  数据质量中心-质量监控
              path: "/dataQuality/qualityMonitor",
              name: "qualityMonitor",
              component: () =>
                import("@/views/manage/dataQuality/qualityMonitor"),
              children: []
            },
            {
              //  数据质量中心-数据比对
              path: "/dataQuality/dataComparison",
              name: "dataComparison",
              component: () =>
                import("@/views/manage/dataQuality/dataComparison"),
              children: []
            },
            {
              //  数据质量中心-质量大屏
              path: "/dataQuality/qualityView",
              name: "qualityView",
              component: () => import("@/views/manage/dataQuality/qualityView"),
              children: []
            },
            {
              //  数据质量中心-运行日志
              path: "/dataQuality/runRecord",
              name: "runRecord",
              component: () => import("@/views/manage/dataQuality/runRecord"),
              children: []
            },
            {
              //  权限中心-项目组管理
              path: "/powerCenter/teamManage",
              name: "teamManage",
              component: () => import("@/views/manage/powerCenter/teamManage"),
              children: []
            },
            {
              //  权限中心-项目管理
              path: "/powerCenter/projectManage",
              name: "projectManage",
              component: () =>
                import("@/views/manage/powerCenter/projectManage"),
              children: []
            },
            {
              //  权限中心-角色管理
              path: "/powerCenter/roleManage",
              name: "roleManage",
              component: () => import("@/views/manage/powerCenter/roleManage"),
              children: []
            },
            {
              //  权限中心-用户管理
              path: "/powerCenter/userManage",
              name: "userManage",
              component: () => import("@/views/manage/powerCenter/userManage"),
              children: []
            },
            {
              //  权限中心-权限申请
              path: "/powerCenter/permissionApplication",
              name: "permissionApplication",
              component: () =>
                import("@/views/manage/powerCenter/permissionApplication"),
              children: []
            },
            {
              //  权限中心-审批管理
              path: "/powerCenter/approveManage",
              name: "approveManage",
              component: () =>
                import("@/views/manage/powerCenter/approveManage"),
              children: []
            },
            {
              //  安全中心-数据安全等级
              path: "/securityCenter/dataSecurityLevel",
              name: "dataSecurityLevel",
              component: () =>
                import("@/views/manage/securityCenter/dataSecurityLevel"),
              children: []
            },
            {
              //  安全中心-数据脱敏
              path: "/securityCenter/dataDesensitization",
              name: "dataDesensitization",
              component: () =>
                import("@/views/manage/securityCenter/dataDesensitization"),
              children: []
            },
            {
              //  安全中心-脱敏规则
              path: "/securityCenter/desensitizationRule",
              name: "desensitizationRule",
              component: () =>
                import("@/views/manage/securityCenter/desensitizationRule"),
              children: []
            },
            {
              //  安全中心-敏感类型
              path: "/securityCenter/sensitiveType",
              name: "sensitiveType",
              component: () =>
                import("@/views/manage/securityCenter/sensitiveType"),
              children: []
            },
            {
              //  安全中心-操作审计
              path: "/securityCenter/operationalAudit",
              name: "operationalAudit",
              component: () =>
                import("@/views/manage/securityCenter/operationalAudit"),
              children: []
            },

            {
              //  指标系统-修饰词
              path: "/quotaManage/decorationWords",
              name: "decorationWords",
              component: () =>
                import("@/views/manage/quotaManage/decorationWords"),
              children: []
            },
            {
              //  指标系统-衍生词
              path: "/quotaManage/derivativeWords",
              name: "derivativeWords",
              component: () =>
                import("@/views/manage/quotaManage/derivativeWords"),
              children: []
            },
            {
              //  指标系统-时间周期
              path: "/quotaManage/timeCycle",
              name: "timeCycle",
              component: () => import("@/views/manage/quotaManage/timeCycle"),
              children: []
            },
            {
              //  指标系统-指标域
              path: "/quotaManage/quotaDomain",
              name: "quotaDomain",
              component: () => import("@/views/manage/quotaManage/quotaDomain"),
              children: []
            },
            {
              //  指标中台-流程测试
              path: "/quotaCenter/graphTest",
              name: "graphTest",
              component: () => import("@/views/manage/quotaCenter/graphTest"),
              children: []
            }
          ]
        }
      ]
    }
  ]
});
