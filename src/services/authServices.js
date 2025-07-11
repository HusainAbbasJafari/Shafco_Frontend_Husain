import { handleError } from "@/utility/handleError";
import { useQuery } from "@tanstack/react-query";
import api from "./api";

const getLoggedInUser = async ({ queryKey, meta }) => {
  const [, token] = queryKey;
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const response = await api.get("/api/Account/UserDetails");
    if (response?.data?.statusCode === 200 && response?.data?.isSuccess === true) {
      return response?.data?.data;
    } else {
      if (meta?.router && response?.data?.statusCode !== 200) {
        handleError(response?.data?.statusCode, meta.router);
      }
      throw new Error(response?.data?.message || "Failed to fetch user.");
    }
  } catch (err) {
    const statusCode = err?.response?.status;
    if (meta?.router && statusCode) {
      handleError(statusCode, meta.router);
    }
    throw err;
  }
};


export const useLoggedInUser = (userId, token, router) => {
  return useQuery({
    queryKey: ['loggedInUser', token],
    queryFn: getLoggedInUser,
    enabled: !!token,
    meta: { router },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
