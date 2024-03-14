import { api } from './index.api'

interface LoginRequest {
  login: string
  password: string
}

interface LoginResponse {
  token: string
}

export interface User {
  id: string
  login: string
  password: string
  avatar: string
  createdAt: string
  updatedAt: string
}

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    check: builder.query<User, void>({
      query: () => ({
        url: '/auth/check',
        method: 'GET',
      }),
    }),
  }),
})

export const { useLoginMutation, useCheckQuery } = authApi
