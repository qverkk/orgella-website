import { basketApi } from "../calls";

export const getUserBasket = (userId) => {
  if (userId == null) {
    return [];
  }

  basketApi({
    method: "GET",
    url: `/basket/${userId}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  }).then((res) => {
    if (res.status != 200) {
      return [];
    }

    return res.data.products;
  });
};

export const addItemToBasket = async (data, userId) => {
  await basketApi({
    method: "POST",
    url: `/basket/${userId}`,
    data,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};

export const deleteBasketItemForUser = (basketItemPath, userId) => {
  basketApi({
    method: "DELETE",
    url: `/basket/${userId}/${basketItemPath}`,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};
