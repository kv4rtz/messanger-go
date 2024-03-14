import {
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { url } from './config'
import { useCookie } from '@/hooks/use-cookie'

export interface ErrorMessage {
  status: number
  data: {
    message: string
  }
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${url}`,
    prepareHeaders: (headers) => {
      const token = useCookie('token')

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: (builder) => ({
    empty: builder.query({
      query: () => '',
    }),
  }),
})
