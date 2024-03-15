import { LkHeader } from '@/components/LkHeader'
import { PropsWithChildren } from 'react'

const LkLayout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <LkHeader />
      <main className="container lg:w-[1000px] mx-auto">{children}</main>
    </div>
  )
}

export default LkLayout
