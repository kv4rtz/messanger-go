'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useLoginMutation } from '@/store/api/auth.api'
import { ErrorMessage } from '@/store/api/index.api'
import { Avatar, Button, Input } from '@nextui-org/react'
import clsx from 'clsx'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useEffect, useRef, useState, DragEvent } from 'react'
import { useForm } from 'react-hook-form'

interface LoginForm {
  login: string
  password: string
}

interface FileObject {
  current: File
  preview: string
}

export const RegisterCard = () => {
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
  const inputUploader = useRef<HTMLInputElement>(null)

  const onSubmitLoginForm = (data: LoginForm) => {
    login(data)
  }
  const upload = () => {
    if (inputUploader.current) {
      inputUploader.current.click()
    }
  }
  const [file, setFile] = useState<FileObject | null>(null)
  const handleInputUploader = () => {
    if (inputUploader.current) {
      if (inputUploader.current.files) {
        const file = inputUploader.current.files[0]
        const url = URL.createObjectURL(file)

        setFile({ current: file, preview: url })
      }
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    const url = URL.createObjectURL(file)

    setFile({ current: file, preview: url })
  }
  return (
    <div className="w-[500px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="py-2 px-3 bg-default-100 rounded-medium cursor-pointer"
        >
          <p className="text-foreground-500 text-small">Аватар</p>
          <div className="flex gap-3 items-center mt-2">
            <Button onClick={upload}>Загрузить</Button>
            {file ? (
              <>
                <Avatar src={file.preview} />
                <p className="text-small text-foreground-500">
                  {file.current.name}
                </p>
              </>
            ) : (
              <p className="text-small text-foreground-500">
                Или перетащите сюда
              </p>
            )}
          </div>
          <input
            onChange={handleInputUploader}
            ref={inputUploader}
            className="hidden"
            type="file"
          />
        </label>
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
