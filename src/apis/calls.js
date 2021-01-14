import axios from "axios";

const usersApi = axios.create({
  baseURL: "/api/users-ws",
});

usersApi.interceptors.request.use(function (config) {
  if (config.url.endsWith("/login") || config.url.endsWith("/register")) {
    return config;
  }

  const token = localStorage.token;
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

export { usersApi };
