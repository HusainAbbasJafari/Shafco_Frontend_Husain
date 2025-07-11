
import { handleError } from "@/utility/handleError";
import { useQuery } from "@tanstack/react-query";
import api from "./api";


export const getWebProducts = async ({ queryKey, meta }) => {
    try {
        const [_key, { pageSize, pageNumber, searchQuery, filters, parentId = null, id = null, sortBy = null, userId = null }] = queryKey;
        const response = await api.post("api/Product/GetWebProductsWithFilterSortSearch", {
            id,
            parentId,
            fromPrice: filters?.fromPrice || 1,
            toPrice: filters?.toPrice || 10000,
            sizeParams: filters?.sizeParams || [],
            brandIdParams: filters?.brandIdParams || [],
            colorParams: filters?.colorParams || [],
            sortBy,
            searchTerm: searchQuery || "",
            pageNumber: pageNumber || 1,
            pageSize: pageSize || 12,
            userId: userId ? userId : null
        });
        if (response?.data?.statusCode === 200 && response?.data?.isSuccess) {
            return response?.data;
        } else {
            if (meta?.router && !response?.data?.statusCode === 200) handleError(response?.data?.statusCode, meta?.router);
            throw new Error(response?.data?.message || "Failed to fetch products.");
        }
    } catch (err) {
        const statusCode = err?.response?.status;
        if (meta?.router && statusCode) {
            handleError(statusCode, meta?.router);
        }
        throw err;
    }
};

export const getProductDetails = async ({ queryKey, meta }) => {

    try {

        const [_key, { productId = null }] = queryKey;
        const response = await api.post("/api/Product/GetProductDetails", { productId });
        if (response?.data?.statusCode === 200 && response?.data?.isSuccess) {
            return response?.data;
        } else {
            if (meta?.router && !response?.data?.statusCode === 200) handleError(response?.data?.statusCode, meta?.router);
            throw new Error(response?.data?.message || "Failed to fetch product details.");
        }
    } catch (err) {
        const statusCode = err?.response?.status;
        if (meta?.router && statusCode) {
            handleError(statusCode, meta?.router);
        }
        throw err;
    }
};




export const getDashboardDetails = async ({ meta }) => {
    try {
        const response = await api.post("/api/Product/GetDashboardDetails");
        if (response.data.statusCode === 200 && response.data.isSuccess === true) {
            return response.data;
        } else {
            if (meta?.router && !response?.data?.statusCode === 200) handleError(response?.data?.statusCode, meta?.router);
            throw new Error(response.data.message || "Failed to fetch dashboard details.");
        }
    }
    catch (err) {
        const statusCode = err?.response?.status;
        if (meta?.router && statusCode) {
            handleError(statusCode, meta.router);
        }
        throw err;
    }
}

export const getFilterParams = async ({ queryKey, meta }) => {
    try {
        const [_key, { id = null, parentId = null, userId = null }] = queryKey;
        const response = await api.post("/api/Product/GetFilterParameters", { id, parentId, userId }
        );

        if (response?.data?.statusCode === 200 && response?.data?.isSuccess === true) {
            return response.data;
        } else {
            if (meta?.router && !response?.data?.statusCode === 200) handleError(response?.data?.statusCode, meta?.router);
            throw new Error(response.data.message || "Failed to fetch filter params.");
        }
    }
    catch (err) {
        const statusCode = err?.response?.status;
        if (meta?.router && statusCode) {
            handleError(statusCode, meta.router);
        }
        throw err;
    }
}

export const getProductById = async ({ queryKey, meta }) => {
    try {
        const [_key, id] = queryKey;
        const response = await api.get(`/api/Product/GetProductById/${id}`);
        const statusCode = response?.data?.statusCode;

        if (statusCode === 200 && response?.data?.isSuccess === true) {
            return response.data.data;
        } else {
            if (meta?.router && !response?.data?.statusCode === 200) handleError(statusCode, meta.router);
            throw new Error(response.data.message || "Failed to fetch product.");
        }
    } catch (err) {
        const statusCode = err?.response?.status;
        if (meta?.router && statusCode) handleError(statusCode, meta.router);
        throw err;
    }
};

export const getAllCategoriesList = async ({ meta }) => {
    try {
        const response = await api.get("/api/Product/GetAllCategoriesList");
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

export const useAllCategoriesList = (router) => {
    return useQuery({
        queryKey: ['allCategoriesList'],
        queryFn: getAllCategoriesList,
        meta: { router },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
}
export const useFilterParams = (params, router) => {
    return useQuery({
        queryKey: ["filterParams", params],
        queryFn: getFilterParams,
        meta: { router },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};

export const useWebProducts = (params, router) => {
    return useQuery({
        queryKey: ['webProducts', params],
        queryFn: getWebProducts,
        meta: { router },
        keepPreviousData: true,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};
export const useDashboard = (router) => {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardDetails,
        meta: { router },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
}

export const useProductDetails = (params, router) => {


    return useQuery({
        queryKey: ['productDetails', params],
        queryFn: getProductDetails,
        meta: { router },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        enabled: !!params?.productId,
    });
};

export const useProduct = (id, router) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: getProductById,
        meta: { router },
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });
};
