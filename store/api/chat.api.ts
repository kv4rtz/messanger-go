import { api } from './index.api'

interface Response {
  message: string
}

interface CreateChat {
  id: number
  name: string
}

const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<Response, CreateChat>({
      query: (data) => ({
        url: `/chats/${data.id}`,
        method: 'POST',
        body: {
          name: data.name,
        },
      }),
    }),
  }),
})

export const { useCreateChatMutation } = chatApi
