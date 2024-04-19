import axios from "axios";
import { baseUrl } from "./common";
axios.defaults.withCredentials = true;

const BASEURL = baseUrl();

const service = axios.create({
  baseURL: BASEURL,
  timeout: 100000
});

service.interceptors.request.use(
  config => {
    let token = sessionStorage.getItem("token");
    if (token && !config.anonymous) {
      config.headers.common["apiToken"] = token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    return error.response;
  }
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return error.response;
  }
);

export default service;
