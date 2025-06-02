import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from 'redux-persist';

const initialState = {
    user: null,
    isAuthenticated: false
}

const authslice = createSlice({
    name: "auth",
    initialState,   
    reducers:{
        userLoggedIn:(state,action)=>{
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        userLoggedOut:(state)=>{
            state.user = null;
            state.isAuthenticated = false; 
        }
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action) => {
            if (action.payload?.auth) {
                return {
                    ...state,
                    ...action.payload.auth
                }
            }
        })
    }
})

export const {userLoggedIn, userLoggedOut} = authslice.actions;
export default authslice.reducer;