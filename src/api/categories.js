import client from "./client"

export const getCategories = () =>
  client.get("/ecommerce/categories")