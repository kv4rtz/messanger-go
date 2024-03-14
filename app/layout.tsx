import { PropsWithChildren } from 'react'
import './globals.css'
import '@flaticon/flaticon-uicons/css/regular/rounded.css'
import { Providers } from '@/components/Providers'
import { Montserrat } from 'next/font/google'
import clsx from 'clsx'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
})

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="ru">
      <body className={clsx('dark', 'min-h-dvh', montserrat.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}