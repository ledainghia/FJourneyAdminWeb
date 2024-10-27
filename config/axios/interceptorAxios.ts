import { User, token } from '@/datatype/userType';
import { getUser } from '@/helper/checkuser';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://api.fjourney.site';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token: token | null = getUser();
        if (!token) {
            return config;
        }
        const accessTokenDecode: User = jwtDecode(token.accessToken);

        if (accessTokenDecode.exp * 1000 < Date.now()) {
            window.location.href = '/auth/login';
            return config;
        }
        config.headers.Authorization = `Bearer ${token.accessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
