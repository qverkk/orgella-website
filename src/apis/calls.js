import axios from "axios";

const usersApi = axios.create({
  baseURL: "/api/users-ws",
  withCredentials: true,
});

const auctionsApi = axios.create({
  baseURL: "/api/auctions-ws",
  withCredentials: true,
});

const basketApi = axios.create({
  baseURL: "/api/users-basket-ws",
  withCredentials: true,
});

const ordersApi = axios.create({
  baseURL: "/api/orders-ws",
  withCredentials: true,
});

export { usersApi, auctionsApi, basketApi, ordersApi };
