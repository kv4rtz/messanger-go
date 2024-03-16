'use client'

import { useCookie } from '@/hooks/use-cookie'
import { useTime } from '@/hooks/use-time'
import { User } from '@/store/api/auth.api'
import { url, wsUrl } from '@/store/api/config'
import { RootState } from '@/store/store'
import { Avatar, Button, Textarea } from '@nextui-org/react'
import clsx from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

interface Message {
  event: string
  message: {
    id: number
    text: string
    userId: number
    chatId: number
    createdAt: string
    updatedAt: string
    user: User
  }
}

export const ChatIdPage = () => {
  const params = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const socket = useRef<WebSocket>()
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<{
    message: string
  }>({ mode: 'onChange' })
  const messangerRef = useRef<HTMLDivElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const loggedUser = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    socket.current = new WebSocket(
      `${wsUrl}/ws/${params.id}?authorization=Bearer ${useCookie('token')}`,
    )

    socket.current.onmessage = (event) => {
      setMessages((prev) => [...prev, JSON.parse(event.data)])
      setTimeout(() => {
        messangerRef.current?.scrollTo(0, messangerRef.current.scrollHeight * 2)
      }, 0)
    }

    // window.addEventListener('keydown', (e) => {
    //   if (e.key === 'Enter') {
    //     if (sendButtonRef.current) {
    //       sendButtonRef.current.click()
    //     }
    //   }
    // })
  }, [])

  const handleSend = (data: { message: string }) => {
    if (socket.current) {
      socket.current.send(data.message)
      setTimeout(() => {
        reset()
      }, 0)
    }
  }

  return (
    <div className="h-[85dvh]">
      <div ref={messangerRef} className="overflow-y-scroll h-[100%] messanger">
        <div className="flex flex-col justify-end gap-1 sm:gap-0 h-full">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                'flex gap-3 sm:w-full w-fit sm:bg-black hover:bg-default-200 bg-default-100 transition-all py-3 px-2 rounded-medium last:mb-10',
                {
                  'bg-primary-400 hover:bg-primary-300 self-end sm:self-start':
                    loggedUser?.id === msg.message.userId,
                },
              )}
            >
              <Avatar
                className="sm:block hidden"
                src={`${url}/${msg.message.user.avatar}`}
              />
              <div className="flex-grow flex flex-col-reverse sm:flex-col">
                <div
                  className={clsx(
                    `flex sm:flex-row`,
                    {
                      'flex-row-reverse': loggedUser?.id === msg.message.userId,
                    },
                    `justify-between`,
                  )}
                >
                  <h3
                    className={clsx(
                      'text-small text-primary-300 sm:block hidden',
                    )}
                  >
                    {msg.message.user.login}
                  </h3>
                  <time className="text-default-500 sm:text-small text-[10px]">
                    {useTime(msg.message.createdAt)}
                  </time>
                </div>
                <p
                  className={clsx('text-small sm:w-[400px] w-fit', {
                    'text-end sm:text-start sm:self-start self-end':
                      loggedUser?.id === msg.message.userId,
                  })}
                >
                  {msg.message.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        className="fixed bottom-[20px] container lg:w-[1000px]"
        onSubmit={handleSubmit(handleSend)}
      >
        <div className="relative">
          <Textarea
            minRows={1}
            maxRows={4}
            placeholder="Напишите сообщение"
            {...register('message', { required: true })}
          />
          <Button
            className={clsx(
              { hidden: !isValid },
              'absolute right-[5px] top-[3px]',
            )}
            ref={sendButtonRef}
            size="sm"
            type="submit"
            color="primary"
            isIconOnly
            startContent={
              <i className="fi fi-sr-paper-plane-top text-[16px] h-[16px]"></i>
            }
          />
        </div>
      </form>
    </div>
  )
}
