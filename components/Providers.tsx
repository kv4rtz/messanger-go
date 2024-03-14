'use client'

import { store } from '@/store/store'
import { NextUIProvider } from '@nextui-org/react'
import { PropsWithChildren } from 'react'
import { Provider } from 'react-redux'

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <NextUIProvider>
      <Provider store={store}>{children}</Provider>
    </NextUIProvider>
  )
}
