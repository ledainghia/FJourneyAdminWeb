import { Category, Zone } from '@/datatype/manageType';
import { userLogin } from '@/datatype/userType';
import axios from 'axios';
import axiosInstance from './interceptorAxios';
import { Product } from '@/datatype/productType';
import { add, update } from 'lodash';
import { ZonePrices } from '@/datatype/zoneType';

const baseUrl = 'https://api.fjourney.site';

export const authAPI = {
    login: async (user: userLogin) => {
        return await axios.post(`${baseUrl}/api/auth/login`, user);
    },
};

export const userAPI = {
    getUser: async () => {
        return await axios.get(`${baseUrl}/api/auth/user-info`);
    },
    updateDeviceToken: async (token: string) => {
        return await axiosInstance.put(`/api/user/update/deviceid/${token}`);
    },
    getNotifications: async () => {
        return await axiosInstance.get(`/api/notifications`);
    },
};

type pagination = {
    page: number;
    pageSize: number;
};

export const managementAPI = {
    getUsers: async ({ page, pageSize }: pagination) => {
        console.log(page, pageSize);
        return await axios.get(`${baseUrl}/api/users?Page=${page}&PageSize=${pageSize}`);
    },
    getDriversVerify: async () => {
        return await axios.get(`${baseUrl}/api/users?Role=Driver`);
    },
    getDriverVerifyDetail: async (id: number) => {
        return await axios.get(`${baseUrl}/api/users/${id}`);
    },
    verifyDriver: async (id: number, errorcodes: number[]) => {
        return await axios.post(`${baseUrl}/api/users/change-status`, {
            userId: id,
            errorCodes: errorcodes,
        });
    },

    getZones: async ({ pageSize, page }: pagination) => {
        return await axios.get(`${baseUrl}/api/zones?Page=${page}&PageSize=${pageSize}`);
    },
    createZones: async (zone: Zone) => {
        return await axios.post(`${baseUrl}/api/zones`, zone);
    },

    updateZone: async (zone: Zone) => {
        return await axios.put(`${baseUrl}/api/zones/${zone.id}`, zone);
    },

    deleteZone: async (id: string) => {
        return await axios.delete(`${baseUrl}/api/zones/${id}`);
    },

    getPricesTable: async () => {
        return await axios.get(`${baseUrl}/api/pricetables`);
    },
    createPricesTable: async (data: ZonePrices) => {
        return await axios.post(`${baseUrl}/api/pricetables`, data);
    },
    updatePricesTable: async (data: ZonePrices) => {
        return await axios.put(`${baseUrl}/api/pricetables/${data.id}`, data);
    },
    deletePricesTable: async (id: string) => {
        return await axios.delete(`${baseUrl}/api/pricetables/${id}`);
    },

    changeStatusUser: async (id: string, status: string) => {
        return await axiosInstance.put(`/api/user/status`, {
            userId: id,
            status: status,
        });
    },
    changeRoleUser: async (id: string, role: 1 | 1002) => {
        return await axiosInstance.put('/api/user/role', {
            userId: id,
            roleId: role,
        });
    },
    addUser: async (data: FormData) => {
        return await axiosInstance.post(`/api/auth/register`, data);
    },
    getCustomers: async (filter: string) => {
        return await axiosInstance.get(`/api/customers/filter?${filter}`);
    },
    changeStatusCustomer: async (id: string, status: 'Active' | 'Inactive') => {
        return await axiosInstance.put(`/api/customer/status`, {
            customerId: id,
            status: status,
        });
    },
    // Start of CRUD for Collection
    getCollections: async (filter: string) => {
        return await axiosInstance.get(`/api/collections/filter?${filter}`);
    },
    putCollection: async (data: any) => {
        return await axiosInstance.put(`/api/collection`, data);
    },
    postCollection: async (data: any) => {
        return await axiosInstance.post(`/api/collection`, data);
    },
    deleteCollection: async (id: string) => {
        return await axiosInstance.delete(`/api/collection/${id}`);
    },
    getCollectionById: async (id: string) => {
        return await axiosInstance.get(`/api/collection/${id}`);
    },
    changeStatusCollection: async (id: string, status: string) => {
        return await axiosInstance.put(`/api/status?collectionId=${id}`, {
            status: status,
        });
    },
    // End of CRUD for Collection

    // Start of CRUD for Campaign
    getCampaigns: async (filter: string) => {
        return await axiosInstance.get(`/api/campaigns/filter?${filter}`);
    },
    getCampaignById: async (id: string, filter: string) => {
        return await axiosInstance.get(`/api/campaigns/${id}?${filter}`);
    },
    putCampaign: async (data: any) => {
        return await axiosInstance.put(`/api/campaign`, data);
    },
    postCampaign: async (data: any) => {
        return await axiosInstance.post(`/api/campaign`, data);
    },
    deleteCampaign: async (id: string) => {
        return await axiosInstance.delete(`/api/campaign/${id}`);
    },
    changeStatusCampaign: async (id: string, status: string) => {
        return await axiosInstance.put(`/api/campaign/${id}/status`, {
            status: status,
        });
    },
    // End of CRUD for Campaign

    // Start of CRUD for Order
    getOrders: async (filter: string) => {
        return await axiosInstance.get(`/api/orders/filter?${filter}`);
    },
    // End of CRUD for Order

    // Start of CRUD for Product
    getProducts: async (filter: string) => {
        return await axiosInstance.get(`/api/products/filter?${filter}`);
    },
    getProductById: async (id: string) => {
        return await axiosInstance.get(`/api/products/${id}`);
    },
    postProduct: async (data: Product) => {
        return await axiosInstance.post(`/api/product/create-multi-size-color`, data);
    },
    addRecommentProduct: async (data: any) => {
        return await axiosInstance.post(`/api/product/recommended-products`, data);
    },
    // End of CRUD for Product

    // Start of CRUD for Category
    getCategories: async (filter: string) => {
        return await axiosInstance.get(`/api/categories/filter?${filter}`);
    },
    postCategory: async (data: FormData) => {
        return await axiosInstance.post(`/api/category`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    putCategory: async (data: Category) => {
        return await axiosInstance.put(`/api/categorie`, data);
    },
    deleteCategory: async (id: string) => {
        return await axiosInstance.delete(`/api/category/${id}`);
    },
    putCategoryStatus: async (id: string, status: string) => {
        return await axiosInstance.put(`/api/categorie/${id}/status`, {
            status: status,
        });
    },
    changeStatusCategory: async (id: string, status: string) => {
        return await axiosInstance.put(`/api/category/${id}/status`, {
            status: status,
        });
    },
    // End of CRUD for Category
};
