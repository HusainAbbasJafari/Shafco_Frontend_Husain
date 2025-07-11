

import { handleError } from "@/utility/handleError";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

export const getCartList = async ({ meta }) => {
  try {
    const response = await api.get("/api/Cart/GetCartItems");
    if (response?.data?.statusCode === 200 && response?.data?.isSuccess === true) {
      return response?.data?.data;
    } else {
      if (meta?.router && !response?.data?.statusCode === 200) handleError(response?.data?.statusCode, meta?.router);
      throw new Error(response?.data?.message || "Failed to fetch categories.");
    }
  } catch (err) {
    const statusCode = err?.response?.status;
    if (meta?.router && statusCode) {
      handleError(statusCode, meta.router);
    }
    throw err;
  }
}

export const getWishList = async ({ meta }) => {
  try {
    const response = await api.get("/api/WishlistItem/GetWishlistItems");
    if (response?.data?.statusCode === 200 && response?.data?.isSuccess === true) {
      return response?.data?.products || [];
    } else {
      if (meta?.router && response?.data?.statusCode !== 200) {
        handleError(response.data.statusCode, meta.router);
      }
      return [];
    }
  } catch (err) {
    const statusCode = err?.response?.status;
    if (meta?.router && statusCode) {
      handleError(statusCode, meta.router);
    }
    return [];
  }
};

export const useWishList = (router) => {
  return useQuery({
    queryKey: ['wishList'],
    queryFn: getWishList,
    meta: { router },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

export const useCart = (router) => {
  return useQuery({
    queryKey: ['cartList'],
    queryFn: getCartList,
    meta: { router },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}

