import { auctionsApi } from "../calls";

export const findAuctions = async (query, category, page, callback) => {
  const response = await auctionsApi({
    method: "GET",
    url: "/auctions/find",
    params: {
      query,
      category,
      page,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};

export const getAuctionDetails = async (auctionPath, callback) => {
  const response = await auctionsApi({
    method: "GET",
    url: "/auctions/details/" + auctionPath,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};
