import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authslice";
import rootreducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
export const appStore=configureStore({
    reducer:rootreducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([authApi.middleware]),
})