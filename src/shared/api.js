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
        }),
        getTransactions: build.query({
            query: ({page, pageSize, sort, search}) => ({
                url: `client/transactions`,
                method: 'GET',
                params: {page, pageSize, sort, search}
            }),
            providesTags: ['Transactions'],
        }),
        getLogin: build.query({
            query: ({email, password}) => ({
                url: `user/login`,
                method: 'POST',
                params: {email, password}
            }),
            providesTags: ['Login'],
        }),
        getLoginWithGoogle: build.query({
            query: ({email}) => ({
                url: `user/loginGG`,
                method: 'POST',
                params: {email}
            }),
            providesTags: ['LoginWithGoogle'],
        }),
        getRegister: build.query({
            query: ({email, name, password, avatar}) => ({
                url: `user/register`,
                method: 'POST',
                params: {email, name, password, avatar}
            }),
            providesTags: ['Register'],
        }),
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