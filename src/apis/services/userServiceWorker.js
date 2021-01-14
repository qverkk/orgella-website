import { usersApi } from "../calls";

export const loginUser = async (username, password, callback) => {
  const response = await usersApi({
    method: "POST",
    url: "/users/login",
    data: {
      username: username,
      password: password,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  const token = response.headers.token;
  if (token != null) {
    localStorage.token = token;
  }
  const userid = response.headers.userid;
  if (userid != null) {
    localStorage.userid = userid;
  }
  callback({ status: response.status, data: response.data });
};
