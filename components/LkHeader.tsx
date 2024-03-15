'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useCheckQuery } from '@/store/api/auth.api'
import { url } from '@/store/api/config'
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
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const LkHeader = () => {
  const { data, isLoading, refetch } = useCheckQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const dispatch = useDispatch()

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

  const title = usePathname() === '/lk' ? 'Список пользователей' : ''
  return (
    <header className="container lg:w-[1000px] mx-auto py-5">
      {isLoading ? (
        <CircularProgress />
      ) : (
        data && (
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Dropdown>
              <DropdownTrigger>
                <User
                  name={data.login}
                  description={new Date(data.createdAt).toLocaleDateString(
                    'ru-RU',
                  )}
                  avatarProps={{ src: `${url}/${data.avatar}` }}
                  className="cursor-pointer"
                />
              </DropdownTrigger>
              <DropdownMenu>
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
