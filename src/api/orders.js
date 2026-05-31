import client from "./client";

export const placeOrder = (addressId) =>
    client.post("/ecommerce/orders", {addressId})

export const getOrders = (page = 1, limit = 5) =>
    client.get("/ecommerce/orders", { params: { page, limit } })

export const getOrderById = (orderId) =>
    client.get(`/ecommerce/orders/${orderId}`)