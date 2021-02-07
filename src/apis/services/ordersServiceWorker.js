import { ordersApi } from "../calls";

export const getOrdersForUser = async (userId) => {
  if (userId == null) {
    return;
  }

  const response = await ordersApi({
    method: "GET",
    url: `/orders/${userId}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  return response.data;
};

export const getOrdersForSeller = async (sellerId, callback) => {
  if (sellerId == null) {
    return;
  }
  const response = await ordersApi({
    method: "GET",
    url: `/orders/seller/${sellerId}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};

export const purchaseItems = async (data, userId, callback) => {
  const response = await ordersApi({
    method: "POST",
    url: `/orders/${userId}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    data,
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};
