import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import router from "@/router";
import { baseUrl } from "@/api/common";
axios.defaults.withCredentials = true;

const BASEURL = baseUrl();

const warnCode = {
  "429": "服务器正忙，请稍后重试",
  "040003": "用户名或密码错误",
  "040061": "用户名或密码错误"
};

const errorCode = {
  "401": "尚未登录或登录信息已失效，请登录",
  "403": "当前操作没有权限",
  "405": "访问请求方法不被允许",
  "406": "用户名或密码错误",
  "400": "请求参数类型不对应！",
  "500": "服务器异常！",
  default: "出错啦,请反馈给管理员"
};

const service = axios.create({
  baseURL: BASEURL,
  timeout: 100000
});

// request interceptor
service.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    if (token && !config.anonymous) {
      config.headers.common["apiToken"] = token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    Message({
      message: errorCode["default"],
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const res = response.data;

    if (res.code && res.code != "200") {
      let message = warnCode[res.code] || res.msg || res.message || "处理失败";
      Message({
        message: message,
        type: "error",
        duration: 5 * 1000
      });
      // return Promise.reject(new Error(message));
    }
    return res;
  },
  error => {
    const errMsg = error.toString();
    if (errMsg.indexOf("code") > -1) {
      const code = errMsg.substr(errMsg.indexOf("code") + 5);
      if (code == "401") {
        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        // MessageBox.alert("token验证失败，请重新登录", "认证失效", {
        //   confirmButtonText: "重新登录",
        //   showClose: false,
        //   type: "error"
        // }).then(() => {
        //   sessionStorage.removeItem("token");
        //   router.push("/login");
        // });
        Message({
          message: "token验证失败，请重新登录!",
          type: "error",
          duration: 5 * 1000
        });
        sessionStorage.removeItem("token");
        router.push("/login");
      } else {
        Message({
          message:
            error.response.data.message ||
            errorCode[code] ||
            errorCode["default"].concat(`,错误编码:${code}`),
          type: "error",
          duration: 5 * 1000
        });
      }
    } else if (errMsg.indexOf("Network Error") > -1) {
      Message({
        message: "网络连接异常或服务器失去响应",
        type: "error",
        duration: 5 * 1000
      });
    }

    return Promise.reject(error);
  }
);

export default service;
