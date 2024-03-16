import Link from 'next/link'
import { UsersList } from '../UsersList'

export const UsersPage = () => {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-xl">Выбор пользователя для диалога</h3>
        <p className="text-small text-default-500">
          Начать общаться вы можете с любым пользователем! Осталось его только
          выбрать из списка ниже. Если у вас уже есть чат с пользователем, то он
          находится в{' '}
          <Link className="text-primary-400" href={'/lk/chats'}>
            ваших чатах
          </Link>
        </p>
      </div>
      <UsersList />
    </div>
  )
}
