import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  totalItems:localStorage.getItem("totalItem") ? JSON.parse(localStorage.getItem("totalItems")):0
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setTotalItems(state,value){
      state.token = value.payload;
    },
  
  },
})

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;