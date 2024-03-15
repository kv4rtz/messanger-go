'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useLoginMutation, useRegisterMutation } from '@/store/api/auth.api'
import { ErrorMessage } from '@/store/api/index.api'
import { Avatar, Button, Input } from '@nextui-org/react'
import clsx from 'clsx'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect, useRef, useState, DragEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Uploader } from './Uploader'

interface LoginForm {
  login: string
  password: string
}

export const RegisterCard = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>()
  const [isVisible, setIsVisible] = useState(false)

  const [registerUser, { data, error }] = useRegisterMutation()
  useEffect(() => {
    if (data?.token) {
      useCookie('token', data.token)
      redirect('/lk')
    }
  }, [data])

  const [avatar, setAvatar] = useState<File | null>(null)

  const onSubmitLoginForm = (data: LoginForm) => {
    if (avatar) {
      const formData = new FormData()
      formData.append('login', data.login)
      formData.append('password', data.password)
      formData.append('avatar', avatar)

      registerUser(formData)
    }
  }
  return (
    <div className="container px-2 md:w-[500px] md:p-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-2xl font-bold text-center">Регистрация</h2>
      <form
        onSubmit={handleSubmit(onSubmitLoginForm)}
        className="flex flex-col gap-2 my-4"
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
        <Uploader title="Аватар" setFileProps={setAvatar} />
        <Button type="submit" color="primary" variant="solid">
          Зарегистрироваться
        </Button>
        {error && (
          <p className="text-red-500 text-sm text-center">
            {(error as ErrorMessage).data.message}
          </p>
        )}
      </form>
      <p className="text-center">
        Есть аккаунт?{' '}
        <Link
          className="text-primary-500 hover:text-primary-400 hover:underline transition-all"
          href={'/'}
        >
          Войти
        </Link>
      </p>
    </div>
  )
}
