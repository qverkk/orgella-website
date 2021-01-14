import axios from "axios";

axios.interceptors.request.use(function (config) {
  console.log("intercept");
  const token = localStorage.token;
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

export { axios };
