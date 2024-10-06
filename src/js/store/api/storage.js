// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const storageApi = createApi({
    reducerPath: 'storageApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/storage' }),
    endpoints: (builder) => ({
        getAvatarUrl: builder.query({
            query: () => '/get-avatar-url',
            transformResponse: (res) => {
                return res.url
            },
            providesTags: (result, err, id) => [{ type: 'User', id }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAvatarUrlQuery } = storageApi
