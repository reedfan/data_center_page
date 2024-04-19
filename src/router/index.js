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
      component: () => import("@/views/manage/modelDesign/tableDetail")
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
              // 数据传输-数据源管理
              path: "/dataTransfer/dataSource",
              name: "dataSource",
              component: () => import("@/views/manage/dataTransfer/dataSource"),
              children: []
            },
            {
              //  数据传输-同步任务
              path: "/dataTransfer/syncTasks",
              name: "syncTasks",
              component: () => import("@/views/manage/dataTransfer/syncTasks"),
              children: []
            },
            {
              //  数据传输-数据导入
              path: "/dataTransfer/dataImport",
              name: "dataImport",
              component: () => import("@/views/manage/dataTransfer/dataImport"),
              children: []
            },
            {
              //  数据传输-离线任务
              path: "/dataTransfer/offlineTasks",
              name: "offlineTasks",
              component: () =>
                import("@/views/manage/dataTransfer/offlineTasks"),
              children: []
            },
            {
              //  数据传输-任务管理
              path: "/dataTransfer/groupJob",
              name: "groupJob",
              component: () => import("@/views/manage/dataTransfer/groupJob"),
              children: []
            },

            {
              //  数据传输-自助分析
              path: "/dataTransfer/selfService",
              name: "selfService",
              component: () =>
                import("@/views/manage/dataTransfer/selfService"),
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
              // 模型设计-主题设计
              path: "/modelDesign/theme",
              name: "theme",
              component: () => import("@/views/manage/modelDesign/theme"),
              children: []
            },
            {
              //  模型设计-分层设计
              path: "/modelDesign/level",
              name: "level",
              component: () => import("@/views/manage/modelDesign/level"),
              children: []
            },
            {
              //  模型设计-数据表
              path: "/modelDesign/dataTable",
              name: "dataTable",
              component: () => import("@/views/manage/modelDesign/dataTable"),
              children: []
            },
            {
              //  模型设计-数据表Old
              path: "/modelDesign/dataTableOld",
              name: "dataTableOld",
              component: () =>
                import("@/views/manage/modelDesign/dataTableOld"),
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
