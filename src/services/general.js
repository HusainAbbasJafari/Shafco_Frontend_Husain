import { handleError } from "@/utility/handleError";
import api from "./api";
import { useQuery } from "@tanstack/react-query";

export const GetAllRoleList = async ({ queryKey, meta }) => {
  try {
    const response = await api.get("api/GeneralSettings/GetAllRoleList", {});
    const statusCode = response?.data?.statusCode;
    if (statusCode === 200 && response?.data?.isSuccess === true) {
      return response?.data?.data;
    } else {
      if (meta?.router && !response?.data?.statusCode === 200) handleError(statusCode, meta.router);
      throw new Error(response?.data?.message || "Failed to fetch RoleList.");
    }
  } catch (err) {
    const statusCode = err?.response?.status;
    if (meta?.router && statusCode) handleError(statusCode, meta.router);
    throw err;
  }
};



export const GetNotificationSetting = async ({ queryKey, meta }) => {
  try {
    const response = await api.get("api/Account/GetNotificationSetting", {});
    const statusCode = response?.data?.statusCode;
    if (statusCode === 200 && response?.data?.isSuccess === true) {
      return response?.data;
    } else {
      if (meta?.router && !response?.data?.statusCode === 200) handleError(statusCode, meta?.router);
      throw new Error(response?.data?.message || "Failed to fetch notification settings.");
    }
  } catch (err) {
    const statusCode = err?.response?.status;
    if (meta?.router && statusCode) handleError(statusCode, meta.router);
    throw err;
  }
};

export const useNotificationSetting = (router) => {
  return useQuery({
    queryKey: ["notificationSettings"],
    queryFn: GetNotificationSetting,
    meta: { router },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};


export const useRoleList = (router) => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: GetAllRoleList,
    meta: { router },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};