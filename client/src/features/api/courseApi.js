import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { userLoggedIn, userLoggedOut } from '../authslice';


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
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getAllCourses: builder.query({
            query: () => ({
                url: "all",
                method: 'GET'
            }),
            providesTags: ['Refetch_Creator_Course']

        }),
        editCourse: builder.mutation({
            query: ({formData,courseId}) => ({
                url: `edit/${courseId}`,
                method: 'PUT',
                body:formData
            }),
            invalidatesTags: ['Refetch_Creator_Course']
        }),
        getCourseById: builder.query({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: 'GET'
            }),
            providesTags: ['Refetch_Creator_Course']
        })
    })
})
//build in hooks created by rtk query   
export const { useCreateCourseMutation, useGetAllCoursesQuery,useEditCourseMutation,useGetCourseByIdQuery } = courseApi;