import { combineReducers } from "@reduxjs/toolkit"

import authReducer from "../slice/authSlice"
import cartReducer from "../slice/cartSlice"
import profileReducer from "../slice/profileSlice"


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  cart: cartReducer,


})

export default rootReducer
