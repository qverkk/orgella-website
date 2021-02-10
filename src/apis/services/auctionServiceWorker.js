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

export const getAuctionReviews = (display, auctionPath, page) => {
  if (auctionPath == null || !display) {
    return;
  }

  auctionsApi({
    method: "GET",
    url: `/auctions/reviews/${auctionPath}`,
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

export const getAuctionReviewsSum = async (auctionPath, callback) => {
  const response = await auctionsApi({
    method: "GET",
    url: "/auctions/reviews/sum/" + auctionPath,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};

export const createAuction = async (formData, callback) => {
  const response = await auctionsApi({
    method: "POST",
    url: "/auctions",
    data: formData,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      console.log(
        `Current progress:`,
        Math.round((event.loaded * 100) / event.total)
      );
    },
    validateStatus: () => true,
  });

  callback({ data: response.data, status: response.status });
};
