// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "@/store/index";
import "@/assets/common/common.css";
import "@/assets/icon/icon.css";

import "animate.css";

import "babel-polyfill";

import echarts from "echarts";
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";

import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/swiper-bundle.min.css";

import HighchartsVue from "highcharts-vue";
import highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";

import VueClipboard from "vue-clipboard2";

import "@/api/permission";

import Vue2OrgTree from "vue2-org-tree";

import VideoPlayer from "vue-video-player";

import JsonViewer from "vue-json-viewer";

// 引入 highlight.js 代码高亮工具
import hljs from "highlight.js";
// 使用样式，有多种样式可选
import "highlight.js/styles/github.css";

import watermark from "@/api/watermark.js";

import VScaleScreen from "v-scale-screen";

require("video.js/dist/video-js.css");
require("vue-video-player/src/custom-theme.css");
Vue.use(VideoPlayer);

Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;
Vue.use(VueAwesomeSwiper);
Vue.use(HighchartsVue);
highcharts3d(highcharts);

Vue.use(VueClipboard);
Vue.use(Vue2OrgTree);
Vue.use(VScaleScreen);
Vue.use(JsonViewer);
Vue.config.productionTip = false;
// 增加自定义命令v-highlight
Vue.directive("highlight", function(el) {
  let blocks = el.querySelectorAll("pre code");
  blocks.forEach(block => {
    hljs.highlightBlock(block);
  });
});
// 增加组定义属性，用于在代码中预处理代码格式
Vue.prototype.$hljs = hljs;
Vue.prototype.$watermark = watermark;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
