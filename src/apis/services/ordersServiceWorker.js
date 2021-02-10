import { ordersApi } from "../calls";

export const updateOrderStatusForId = async (data) => {
  await ordersApi({
    method: "POST",
    url: `/orders/update`,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};

export const getAvailableShippingStatuses = () => {
  ordersApi({
    method: "GET",
    url: `/orders/orderStatus/all`,
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

export const getNonReviewedUserOrders = (userId, page) => {
  if (userId == null) {
    return;
  }

  ordersApi({
    method: "GET",
    url: `/orders/${userId}/nonReviewed`,
    params: {
      page,
    },
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

export const postReview = async (data) => {
  await ordersApi({
    method: "POST",
    url: `orders/create/review`,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};

export const getOrdersMadeBySeller = async (sellerUsername, page) => {
  if (sellerUsername == null) {
    return;
  }

  const response = await ordersApi({
    method: "GET",
    url: `/orders/${sellerUsername}/all`,
    params: {
      page,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  return response.data;
};

export const getOrdersForUser = async (userId, page) => {
  if (userId == null) {
    return;
  }

  const response = await ordersApi({
    method: "GET",
    url: `/orders/${userId}`,
    params: {
      page,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  return response.data;
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
