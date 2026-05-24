import client from "./client";

export const loginUser = (email, password) => 
    client.post("/users/login", {email, password})

export const registerUser = (username, email, password) =>
    client.post("/users/register", {username, email, password})

export const logoutUser = () =>
    client.post("users/logout")

export const getCurrentUser = () => 
    client.get("users/current-user")

export const refreshToken = () =>
    client.post("users/refresh-token")