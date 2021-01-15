import axios from "axios";

const usersApi = axios.create({
  baseURL: "/api/users-ws",
});

usersApi.interceptors.request.use(function (config) {
  if (
    config.url.endsWith("/users/login") ||
    (config.url.endsWith("/users") && config.method === "post")
  ) {
    console.log("No token");
    return config;
  }

  const token = localStorage.token;
  config.headers.authorization = `Bearer ${token}`;
  return config;
});

export { usersApi };
