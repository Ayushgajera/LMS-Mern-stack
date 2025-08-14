import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";



const initialState = {
    user: null,
    isAuthenticated: false,
    role: null,
    loading: false // 🔹 added for /me call status
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    const res = await axios.get("http://localhost:8000/api/v1/user/me", {
        withCredentials: true // important for cookies/session
    });
    return res.data.user;
});

const authslice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.role = action.payload.user.role;
        },
        userLoggedOut: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.role = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(REHYDRATE, (state, action) => {
                if (action.payload?.auth) {
                    return {
                        ...state,
                        ...action.payload.auth
                    };
                }
            })
            // 🔹 fetchUser pending
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            // 🔹 fetchUser success
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.role = action.payload.role;
            })
            // 🔹 fetchUser fail
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.role = null;
            });
    }
});

export const { userLoggedIn, userLoggedOut } = authslice.actions;
export default authslice.reducer;
