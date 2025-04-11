
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn } from '../authslice';
const USER_API = 'http://localhost:8000/api/v1/user/login/'
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl:USER_API,
        credentials: 'include',
    }),
    endpoints:(builder)=>({
        registerUser:builder.mutation({
            query:(inputata)=>({
                url: "register",
                method: 'POST',
                body: inputata
            })
        }),
        loginUser:builder.mutation({
            query:(inputata)=>({
                url: "login",
                method: 'POST',
                body: inputata
            }),
            // it's called when the loginUser activated means triggered loginUser
            async onQueryStarted(_,{queryFulfilled,dispatch})
                {
                    try {
                        //queryFUlfilled used to store data from the server(recieved response from backend)
                        const result = await queryFulfilled;
                        dispatch(userLoggedIn({user:result.data.user}));
                        
                    } catch (error) {
                        console.log(error)

                    }
                } 
        }),
    })
})