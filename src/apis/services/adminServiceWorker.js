import { usersApi } from "../calls";

export const getAvailableRoles = (admin) => {
  if (!admin) {
    return;
  }

  usersApi({
    method: "GET",
    url: `/users/roles/all`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  }).then((res) => {
    if (res.status != 200) {
      return [];
    }

    return res.data;
  });
};

export const getAvailableUsers = (admin) => {
  if (!admin) {
    return;
  }

  usersApi({
    method: "GET",
    url: `/users/users/all`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  }).then((res) => {
    if (res.status != 200) {
      return [];
    }

    return res.data;
  });
};

export const addRoleForUsername = async (data) => {
  await usersApi({
    method: "POST",
    url: `/users/addRole`,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};

export const removeRoleForUsername = async (data) => {
  await usersApi({
    method: "POST",
    url: `/users/removeRole`,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};
