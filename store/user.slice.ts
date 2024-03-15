import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { User } from './api/auth.api'

const initialState: { user: User | null } = {
  user: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    deleteUser: (state) => {
      state.user = null
    },
  },
})

export const { setUser, deleteUser } = userSlice.actions

export default userSlice.reducer
