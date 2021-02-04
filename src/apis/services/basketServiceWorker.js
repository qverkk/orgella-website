import { basketApi } from "../calls";

export const getUserBasket = (userid) => {
  if (userid == null) {
    return [];
  }

  basketApi({
    method: "GET",
    url: "/basket/" + userid,
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

export const deleteBasketItemForUser = (basketItemPath, userId) => {
  basketApi({
    method: "DELETE",
    url: "/basket/" + userId + "/" + basketItemPath,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });
};
