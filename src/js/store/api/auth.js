// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/auth' }),
    endpoints: (builder) => ({
        isAuthenticated: builder.query({
            query: () => '/authenticated',
            transformResponse: (res) => {
                return res.authorized
            },
            providesTags: (result, err, id) => [{ type: 'authenticated', id }],
        }),
        getUserDetails: builder.query({
            query: () => '/user',
            transformResponse: (res) => {
                return res.user
            },
            providesTags: (result, err, id) => [{ type: 'User', id }],
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "GET"
            }),
            transformResponse: ({ data }) => {
                return data.message
            },
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        register: builder.mutation({
            query: (data) => ({
                url: '/register',
                method: 'POST',
                body: data
            }),
            transformResponse: (res) => {
                return res
            },
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),
        login: builder.mutation({
            query: (body) => ({
                body,
                url: '/login',
                method: 'POST'
            }),

            transformResponse: (res) => {
                return res
            },
            invalidatesTags: (result, error, id) => [{ type: 'User', id }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useIsAuthenticatedQuery,
    useGetUserDetailsQuery,
    useLogoutMutation,
    useRegisterMutation,
    useLoginMutation
} = authApi
