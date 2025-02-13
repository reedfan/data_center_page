import Vue from "vue";
import clipboard from "clipboard";
/* 测试环境*/
//const BASEURL = "http://127.0.0.1:8585";
//const BASEURL = "http://192.168.16.114:8585";
const BASEURL = "http://192.168.43.83:8585";
//const BASEURL = "http://47.92.75.41:8585";
//const BASEURL = "http://115.159.223.242:8585";
export function baseUrl() {
  return BASEURL;
}
const UPLOADURL = "http://110.40.151.82:8686";
export function uploadUrl() {
  return UPLOADURL;
}

export function Notify(type, message) {
  Vue.prototype.$message({
    /* title:title, */
    type: type,
    message: message
    /* position: 'bottom-right',
    offset: 30 */
  });
}

export function resetForm(formName, that) {
  if (that.$refs[formName] !== undefined) {
    that.$refs[formName].resetFields();
  }
}
export function copyText(text) {
  clipboard.copy(text);
  Notify("success", "已复制到剪切板");
}
export function dateFormat(fmt, date1) {
  let date = new Date(date1);
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
