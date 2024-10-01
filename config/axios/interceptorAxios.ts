import { User, token } from '@/datatype/userType';
import { getUser } from '@/helper/checkuser';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://api.flocalbrand.site';

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
        const refreshTokenDecode: User = jwtDecode(token.refreshToken);
        if (accessTokenDecode.exp * 1000 < Date.now()) {
            if (refreshTokenDecode.exp * 1000 < Date.now()) {
                if (token.location === 'local') {
                    localStorage.removeItem('user');
                } else {
                    sessionStorage.removeItem('user');
                }
                window.location.href = '/auth/login';
                return config;
            } else {
                const response = await axios.post(`${BASE_URL}/api/auth/access-token`, {
                    refreshToken: token.refreshToken,
                });
                if (response.data.success !== true) {
                    if (token.location === 'local') {
                        localStorage.removeItem('user');
                    } else {
                        sessionStorage.removeItem('user');
                    }
                    return config;
                }
                const newToken: token = response.data.result;
                if (token.location === 'local') {
                    localStorage.setItem('user', JSON.stringify(newToken));
                } else {
                    sessionStorage.setItem('user', JSON.stringify(newToken));
                }
                config.headers.Authorization = `Bearer ${newToken.accessToken}`;
                return config;
            }
        }
        config.headers.Authorization = `Bearer ${token.accessToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
