import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    status: false,
    accessToken: null
}
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.status = true
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.status = false
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer 