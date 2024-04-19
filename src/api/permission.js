/*
 * @Descripttion:
 * @version:
 * @Author: HXW
 * @Date: 2020-03-19 10:40:33
 * @LastEditors: HXW
 * @LastEditTime: 2021-02-26 10:44:42
 */
/* eslint-disable no-undef */
import { MessageBox, Message } from "element-ui";
import router from "@/router";
import store from "@/store";
import request from "@/api/request";

function judgeToPath(toPath) {
  let pathList = [];
  let whiteList = ["/login", "/tableDetail"];
  store.state.pathList.forEach((item, index) => {
    if (item.children.length == 0) {
      pathList.push(item.path);
    } else {
      item.children.forEach((item2, index2) => {
        pathList.push(item2.path);
      });
    }
  });
  return whiteList.includes(toPath) || pathList.includes(toPath);
}

router.beforeEach((to, from, next) => {
  let hasToken = sessionStorage.getItem("token");
  if (to.path == "/login") {
    next();
  } else {
    if (hasToken) {
      if (judgeToPath(to.path)) {
        next();
      } else {
        Message({
          message: "无操作权限！",
          type: "warning",
          duration: 5 * 1000
        });
      }
    } else {
      router.push("/login");
    }
  }
});
