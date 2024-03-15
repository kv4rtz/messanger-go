'use client'

import { User as IUser } from '@/store/api/auth.api'
import { useCreateChatMutation } from '@/store/api/chat.api'
import { url } from '@/store/api/config'
import { useGetAllUsersQuery } from '@/store/api/user.api'
import { RootState } from '@/store/store'
import {
  Button,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  User,
  useDisclosure,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

export const LkPage = () => {
  const { data, isLoading } = useGetAllUsersQuery()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>()

  const loggedUser = useSelector((state: RootState) => state.user.user)

  const handleClick = (user: IUser) => {
    setSelectedUser(user)
    onOpen()
  }

  const [createChatApi, { data: chatData }] = useCreateChatMutation()

  useEffect(() => {
    console.log(chatData)
  }, [chatData])

  const createChat = (data: { name: string }) => {
    if (selectedUser) {
      createChatApi({
        id: selectedUser.id,
        name: data.name,
      })
    }
  }
  return (
    <div className="flex flex-col gap-3">
      {isLoading ? (
        <CircularProgress />
      ) : (
        data &&
        data.map((user) => {
          if (user.id === loggedUser?.id) {
            return null
          }
          return (
            <div
              key={user.id}
              className="flex gap-3 items-center justify-between"
            >
              <User
                key={user.id}
                name={user.login}
                avatarProps={{ src: `${url}/${user.avatar}` }}
              />
              <Button
                startContent={
                  <i className="fi fi-rr-comments text-large h-unit-lg"></i>
                }
                onClick={() => handleClick(user)}
              >
                Начать диалог
              </Button>
            </div>
          )
        })
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Вы собираетесь начать диалог с {selectedUser?.login}
              </ModalHeader>
              <form onSubmit={handleSubmit(createChat)}>
                <ModalBody>
                  <Input
                    {...register('name', {
                      required: 'Поле обязательно для заполнения',
                      minLength: {
                        value: 3,
                        message: 'Минимальная длина 3 символа',
                      },
                      maxLength: {
                        value: 12,
                        message: 'Максимальная длина 12 символов',
                      },
                    })}
                    label="Название чата"
                    isInvalid={!!errors.name}
                    errorMessage={errors.name && errors.name.message}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Отмена
                  </Button>
                  <Button color="primary" type="submit">
                    Начать диалог
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
