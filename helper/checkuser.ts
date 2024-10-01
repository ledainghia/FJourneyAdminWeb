import { token } from '@/datatype/userType';

export const getUser = () => {
    // Check if user is logged in
    const { localStorage, sessionStorage } = window;
    if (!localStorage.getItem('user') && !sessionStorage.getItem('user')) {
        return null;
    }
    const lc = localStorage.getItem('user');
    const sc = sessionStorage.getItem('user');
    if (lc) {
        const data: token = {
            location: 'local',
            accessToken: JSON.parse(lc).accessToken.toString(),
            refreshToken: JSON.parse(lc).refreshToken.toString(),
        };
        return data;
    }
    if (sc) {
        const data: token = {
            location: 'session',
            accessToken: JSON.parse(sc).accessToken.toString(),
            refreshToken: JSON.parse(sc).refreshToken.toString(),
        };
        return data;
    }
    return null;
};
