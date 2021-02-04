import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { authStore } from "../../store/zustand";
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

  // const token = response.headers.token;
  // if (token != null) {
  //   localStorage.token = token;
  // }
  // const userid = response.headers.userid;
  // if (userid != null) {
  //   localStorage.userid = userid;
  // }
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

export const fetchUser = async () => {
  // const userDetails = authStore((state) => state.userDetails);
  // const setUserDetails = authStore((state) => state.setUserDetails);
  // const authenticate = authStore((state) => state.authenticate);
  // const authenticated = authStore((state) => state.authenticated);
  // const logout = authStore((state) => state.logout);

  // if (userDetails) {
  //   return { userDetails, authenticated };
  // }

  const response = await usersApi({
    method: "GET",
    url: "/users/me",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  if (response.status != 200) {
    return {
      error: "Not logged in",
      authenticated: false,
      userDetails: null,
    };
  }

  return { userDetails: response.data, authenticated: true };
};

export function useFetchUser({ required } = {}) {
  const userDetails = authStore((state) => state.userDetails);
  const setUserDetails = authStore((state) => state.setUserDetails);
  const authenticate = authStore((state) => state.authenticate);
  const logout = authStore((state) => state.logout);

  const router = useRouter();
  const [loading, setLoading] = useState(() => !userDetails);
  const [result, setResult] = useState(() => {
    return userDetails || null;
  });

  useEffect(() => {
    if (!loading && result) {
      return;
    }
    setLoading(true);
    let isMounted = true;

    fetchUser().then((user) => {
      if (isMounted) {
        if (required && !user) {
          router.push("/login");
          return;
        }
        if (!user.error) {
          setResult(user);
          setUserDetails(user);
          authenticate();
        } else {
          return {
            error,
          };
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return { result, loading };
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

  callback({ status: response.status, data: response.data });
};

export const getUserDetails = async () => {
  const response = await usersApi({
    method: "GET",
    url: "/users/qverkk",
    validateStatus: () => true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
};

export const logoutUser = async (logout) => {
  const response = await usersApi({
    method: "GET",
    // url: "/users/logout",
    url: "/logout",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    validateStatus: () => true,
  });

  logout();
};
