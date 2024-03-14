'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useLoginMutation } from '@/store/api/auth.api'
import { ErrorMessage } from '@/store/api/index.api'
import { Button, Input } from '@nextui-org/react'
import clsx from 'clsx'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

interface LoginForm {
  login: string
  password: string
}

export const LoginCard = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>()
  const [isVisible, setIsVisible] = useState(false)
  const [login, { data, error }] = useLoginMutation()
  useEffect(() => {
    if (data?.token) {
      useCookie('token', data.token)
      redirect('/lk')
    }
  }, [data])

  const onSubmitLoginForm = (data: LoginForm) => {
    login(data)
  }
  return (
    <div className="w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-2xl font-bold mb-4 text-center">Вход в аккаунт</h2>
      <form
        onSubmit={handleSubmit(onSubmitLoginForm)}
        className="flex flex-col gap-2"
      >
        <Input
          {...register('login', {
            required: 'Поле обязательно для заполнения',
            minLength: {
              value: 3,
              message: 'Минимальная длина 3 символа',
            },
            maxLength: {
              value: 16,
              message: 'Максимальная длина 16 символов',
            },
          })}
          isInvalid={!!errors.login}
          errorMessage={errors.login && errors.login.message}
          label="Логин"
        />
        <Input
          {...register('password', {
            required: 'Поле обязательно для заполнения',
            minLength: {
              value: 3,
              message: 'Минимальная длина 3 символа',
            },
            maxLength: {
              value: 16,
              message: 'Максимальная длина 16 символов',
            },
          })}
          isInvalid={!!errors.password}
          errorMessage={errors.password && errors.password.message}
          label="Пароль"
          type={isVisible ? 'text' : 'password'}
          endContent={
            <button onClick={() => setIsVisible((prev) => !prev)} type="button">
              <i
                className={clsx(
                  'fi',
                  isVisible ? 'fi-rr-eye-crossed' : 'fi-rr-eye',
                  'opacity-50 hover:opacity-100 transition-all text-xl',
                )}
              ></i>
            </button>
          }
        />
        <Button type="submit" color="primary" variant="solid">
          Войти
        </Button>
        {error && (
          <p className="text-red-500 text-sm text-center">
            {(error as ErrorMessage).data.message}
          </p>
        )}
      </form>
    </div>
  )
}