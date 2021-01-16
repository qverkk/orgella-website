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

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
}

export const registerUser = async (
  firstName,
  lastName,
  dateOfBirth,
  username,
  email,
  password,
  callback
) => {
  const response = await usersApi({
    method: "POST",
    url: "/users",
    data: {
      firstName,
      lastName,
      dateOfBirth: formatDate(dateOfBirth),
      username,
      email,
      password,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  console.log(response);
  callback({ status: response.status, data: response.data });
};
