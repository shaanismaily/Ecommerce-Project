import client from "./client"

export const getAddresses = () =>
    client.get("/ecommerce/addresses")

export const addAddress = (addressData) =>
    client.post("/ecommerce/addresses", addressData)

export const deleteAddress = (addressId) =>
    client.delete(`/ecommerce/addresses/${addressId}`)