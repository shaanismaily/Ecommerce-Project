import client from "./client";

export const getCart = () => 
    client.get("/ecommerce/cart")

export const addToCart = (productId) =>
    client.post(`/ecommerce/cart/item/${productId}`)

export const removeFromCart = (productId) =>
    client.delete(`/ecommerce/cart/item/${productId}`)

export const clearCart = () =>
    client.delete("/ecommerce/cart/clear")