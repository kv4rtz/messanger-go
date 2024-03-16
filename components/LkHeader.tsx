'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useCheckQuery } from '@/store/api/auth.api'
import { useGetChatByIdQuery } from '@/store/api/chat.api'
import { url } from '@/store/api/config'
import { RootState } from '@/store/store'
import { setUser } from '@/store/user.slice'
import {
  CircularProgress,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const LkHeader = () => {
  const { data, isLoading, refetch } = useCheckQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const dispatch = useDispatch()
  const loggedUser = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    if (data) {
      dispatch(setUser(data))
    }
  }, [data])
  const router = useRouter()
  const logOut = async () => {
    useCookie('token', 'logout')
    setTimeout(() => router.push('/'), 300)
    await refetch()
  }

  let title: ReactNode

  const params = useParams()
  const { data: currentChat } = useGetChatByIdQuery(+params.id)

  switch (usePathname()) {
    case '/lk':
      title = (
        <h2 className="text-2xl font-bold flex gap-3 items-center">
          <Image width={30} height={30} src="/Envelope.png" alt="Чаты" />
          Чаты
        </h2>
      )
      break
    case '/lk/chats':
      title = (
        <h2 className="text-2xl font-bold flex gap-3 items-center">
          <Image width={30} height={30} src="/Envelope.png" alt="Чаты" />
          Чаты
        </h2>
      )
      break
    case `/lk/chats/${params.id}`:
      title = (
        <h2 className="text-2xl font-bold flex gap-3 items-center">
          {currentChat &&
            currentChat.users.map((user, idx) => {
              if (user.id !== loggedUser?.id) {
                return (
                  <User
                    key={idx}
                    name={user.login}
                    description={`Название чата: ${currentChat.name}`}
                    avatarProps={{ src: `${url}/${user.avatar}` }}
                  />
                )
              }
            })}
        </h2>
      )
      break
    case '/lk/users':
      title = (
        <h2 className="text-2xl font-bold flex gap-3 items-center">
          <Image width={30} height={30} src="/User.png" alt="Чаты" />
          Пользователи
        </h2>
      )
      break
  }

  return (
    <header className="container lg:w-[1000px] mx-auto py-5 px-2 border border-black border-b-default-200 mb-3">
      {isLoading ? (
        <CircularProgress />
      ) : (
        data && (
          <div className="flex justify-between items-center">
            {title}
            <Dropdown>
              <DropdownTrigger>
                <User
                  as="button"
                  name={data.login}
                  description={new Date(data.createdAt).toLocaleDateString(
                    'ru-RU',
                  )}
                  avatarProps={{ src: `${url}/${data.avatar}` }}
                  className="cursor-pointer transition-transform"
                />
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownSection title="Страницы">
                  <DropdownItem
                    description="Мои чаты"
                    onClick={() => router.push('/lk')}
                    startContent={
                      <i className="fi fi-rr-paper-plane text-default-400"></i>
                    }
                  />
                  <DropdownItem
                    description="Пользователи"
                    onClick={() => router.push('/lk/users')}
                    startContent={
                      <i className="fi fi-rr-user text-default-400"></i>
                    }
                  />
                </DropdownSection>
                <DropdownSection title="Действия">
                  <DropdownItem
                    onClick={logOut}
                    description="Выйти из аккаунта"
                    startContent={
                      <i className="fi fi-rr-exit text-default-400"></i>
                    }
                  />
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          </div>
        )
      )}
    </header>
  )
}
