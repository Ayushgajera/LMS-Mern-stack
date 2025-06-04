import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedIn, userLoggedOut } from '../authslice';


const USER_API = 'http://localhost:8000/api/v1/course';


export const courseApi = createApi({
    reducerPath: 'courseApi',
    tagTypes: ['Refetch_Creator_Course'],
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        credentials: 'include',
        prepareHeaders: (headers) => {
            return headers;

        }
    }),
    endpoints: (builder) => ({
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: 'POST',
                body: { courseTitle, category }
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    //queryFUlfilled used to store data from the server(recieved response from backend)
                    const result = await queryFulfilled;
                    console.log("Course created successfully", result.data);
                } catch (error) {
                    console.error("Error creating course", error);
                }
            }
        }),
        createCourse: builder.mutation({
            query: ({ courseTitle, category }) => ({
                url: "",
                method: 'POST',
                body: { courseTitle, category }
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: "",
                method: 'GET'
            }),
            providesTags: ['Refetch_Creator_Course']

        })
    })
})
//build in hooks created by rtk query   
export const { useCreateCourseMutation, useGetAllCoursesQuery } = courseApi;