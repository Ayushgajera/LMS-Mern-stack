import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
export const appStore=configureStore({
    reducer:{
        auth:authReducer
        
    }
})