'use client'

import { useCheckQuery } from '@/store/api/auth.api'
import { CircularProgress } from '@nextui-org/react'

export const LkPage = () => {
  const { data, isLoading } = useCheckQuery()
  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        data && (
          <div>
            <h2 className="text-2xl font-bold text-center">
              Welcome,{' '}
              <mark className="bg-transparent text-primary-500">
                {data.login}
              </mark>
            </h2>
          </div>
        )
      )}
    </div>
  )
}
