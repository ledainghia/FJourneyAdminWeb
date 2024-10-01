export type userLogin = {
    username: string;
    password: string;
};

export interface token {
    location: string;
    accessToken: string;
    refreshToken: string;
}

export interface User {
    exp: number;
}

export type UserInformation = {
    userId: number;
    userName: string;
    email: string;
    role: string;
    phone: string;
    address: string;
    image: string;
    roleId: number;
};

export type UserAccount = {
    id: number;
    userName: string;
    email: string;
    phone: string;
    address: string;
    roleName: string;
};
