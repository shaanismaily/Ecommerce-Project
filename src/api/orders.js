import client from "./client";

export const placeOrder = (addressId) =>
    client.post("/ecommerce/orders", {addressId})

export const getOrders = () =>
    client.get("/ecommerce/profile/my-orders")

export const getOrderById = (orderId) =>
    client.get(`/ecommerce/products/${orderId}`)