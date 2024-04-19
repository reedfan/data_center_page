import axios from "axios";

axios.defaults.withCredentials = true;

const service = axios.create({
  baseURL: "https://api.weixin.qq.com",
  timeout: 100000
});

service.interceptors.request.use(
  config => {
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
