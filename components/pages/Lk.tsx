'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useCheckQuery } from '@/store/api/auth.api'
import { url } from '@/store/api/config'
import { Avatar, Button, CircularProgress } from '@nextui-org/react'
import { redirect, useRouter } from 'next/navigation'

export const LkPage = () => {
  const { data, isLoading } = useCheckQuery()
  const router = useRouter()
  const logOut = () => {
    useCookie('token', 'logout')
    setTimeout(() => router.push('/'), 300)
  }
  return (
    <div className="flex justify-center items-center min-h-dvh">
      {isLoading ? (
        <CircularProgress />
      ) : (
        data && (
          <div className="flex flex-col items-center gap-3">
            <Avatar src={`${url}/${data.avatar}`} />
            <h2 className="font-bold">{data.login}</h2>
            <Button onClick={logOut}>Выйти из аккаунта</Button>
          </div>
        )
      )}
    </div>
  )
}
