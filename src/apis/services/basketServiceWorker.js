import { basketApi } from "../calls";

export const getUserBasket = async (userid) => {
  const response = await basketApi({
    method: "GET",
    url: "/basket/" + userid,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  if (response.status != 200) {
    return null;
  }

  console.log(response.data);
  return response.data.products;
};
