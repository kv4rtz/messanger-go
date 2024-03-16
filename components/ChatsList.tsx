'use client'

import { useGetChatsQuery } from '@/store/api/chat.api'
import { url } from '@/store/api/config'
import { RootState } from '@/store/store'
import {
  Button,
  Card,
  CardHeader,
  CircularProgress,
  User,
} from '@nextui-org/react'
import Link from 'next/link'
import { useSelector } from 'react-redux'

export const ChatsList = () => {
  const { data, isLoading } = useGetChatsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const loggedUser = useSelector((state: RootState) => state.user.user)
  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <CircularProgress />
      ) : data && data.length ? (
        data.map((chat) => (
          <Link href={`/lk/chats/${chat.id}`}>
            <Card>
              <CardHeader>
                {chat.users.map((user) => {
                  if (user.id !== loggedUser?.id) {
                    return (
                      <User
                        name={user.login}
                        description={`Чат: ${chat.name}`}
                        avatarProps={{
                          src: `${url}/${user.avatar}`,
                        }}
                      />
                    )
                  }
                })}
              </CardHeader>
            </Card>
          </Link>
        ))
      ) : (
        <div>
          <h3 className="text-xl">Здесь будут Ваши чаты</h3>
          <p className="text-small text-default-500">
            Начать общаться вы можете с любым пользователем! Осталось его только
            выбрать по кнопке ниже
          </p>
          <Link className="inline-block mt-3" href={'/lk/users'}>
            <Button color="primary">Выбрать пользователя</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
