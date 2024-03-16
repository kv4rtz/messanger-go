import { useGetAllUsersQuery } from '@/store/api/user.api'
import { User } from '@/store/api/auth.api'
import { api } from './index.api'

interface Response {
  message: string
}

interface Chat {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  users: User[]
}

interface CreateChat {
  id: number
  name: string
}

const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<Response, CreateChat>({
      invalidatesTags: ['chats'],
      query: (data) => ({
        url: `/chats/${data.id}`,
        method: 'POST',
        body: {
          name: data.name,
        },
      }),
    }),
    getChatById: builder.query<Chat, number>({
      providesTags: ['chats'],
      query: (id) => ({
        url: `/chats/${id}`,
        method: 'GET',
      }),
    }),
    getChats: builder.query<Chat[], void>({
      providesTags: ['chats'],
      query: () => ({
        url: `/chats`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetChatByIdQuery, useGetChatsQuery, useCreateChatMutation } =
  chatApi
