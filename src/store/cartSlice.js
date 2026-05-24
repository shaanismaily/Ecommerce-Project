import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    totalPrice: 0,
    totalItems: 0
}
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload.items
            state.totalItems = action.payload.totalItems
            state.totalPrice = action.payload.totalPrice
        },
        clearCart: (state) => {
            state.items = []
            state.totalItems = 0
            state.totalPrice = 0
        }
    }
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer