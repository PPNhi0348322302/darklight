import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
    reducerPath: 'adminApi',
    tagTypes: [
        'User', 
        'Transactions', 
        'Login',
        'LoginWithGoogle',
        'Register'
    ],
    endpoints: (build) => ({
        getUser: build.query({
            query: (id) => `general/user/${id}`,
            providesTags: ['User'],
        })
    })
})

export const {
    useGetUserQuery,
    useGetTransactionsQuery,
    useGetLoginQuery,
    useGetRegisterQuery,
    useGetLoginWithGoogleQuery
} = api

export default api