export type Product = {
    productId?: number;
    productName: string;
    categoryId: string;
    campaignId: string;
    gender: string;
    price: number;
    description: string;
    imageBase64: string;
    status: string;
    productSizes?: ProductSize[];
    id?: number;
};

export type ProductSize = {
    size: string;
    colors: Collor[];
};

type Collor = {
    colorName: string;
    quantity: number;
};

// Define the types for each level of your data structure

export type Collection = {
    id: number;
    collectionName: string;
    status: string;
    products: string[];
};

type OrderDetail = {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product: Product;
};

type Payment = {
    id: number;
    orderId: number;
    paymentDate: string; // ISO 8601 format date
    paymentMethod: string;
    paymentStatus: string;
};

type OrderHistory = {
    id: number;
    orderId: number;
    status: string;
    description: string;
    changeTime: string; // ISO 8601 format date
};

export type Order = {
    id: number;
    customerId: number;
    orderDate: string; // ISO 8601 format date
    totalAmount: number;
    orderStatus: string;
    orderDetails: OrderDetail[];
    payments: Payment[];
    orderHistories: OrderHistory[];
};

// Define the root type which includes an array of orders
export type OrdersResponse = {
    orders: Order[];
};
