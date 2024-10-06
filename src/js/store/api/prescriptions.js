// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const prescriptionApi = createApi({
    reducerPath: 'prescriptionApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/prescriptions' }),
    endpoints: (builder) => ({
        getPrescriptions: builder.query({
            query: () => '/',
            transformResponse: (response) => {
                return response.data
            },
            providesTags: (result, err, id) => [{ type: 'Prescriptions', id }],
        }),
        createPrescription: builder.mutation({
            query: (body) => ({
                url: '/create',
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Prescriptions', id }],
        }),
        getOngoingPrescriptions: builder.query({
            query: () => '/ongoing',
            transformResponse: (response) => response.data,
            providesTags: (result, err, id) => [{ type: 'Prescriptions', id }],
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPrescriptionsQuery, useCreatePrescriptionMutation, useGetOngoingPrescriptionsQuery } = prescriptionApi
