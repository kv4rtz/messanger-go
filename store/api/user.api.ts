import { api } from './index.api'

export interface User {
  id: number
  login: string
  password: string
  avatar: string
  createdAt: string
  updatedAt: string
}

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetAllUsersQuery } = userApi
