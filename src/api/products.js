import client from "./client";

export const getProducts = (page=1, limit=9) => 
    client.get("/ecommerce/products", {params: { page, limit }})

export const getProductById = (productId) =>
    client.get(`/ecommerce/products/${productId}`)

export const getProductsByCategory = (categoryId) =>
    client.get(`/ecommerce/products/category/${categoryId}`)