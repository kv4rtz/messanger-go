import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LoginCard } from '../LoginCard'

export const HomePage = () => {
  return (
    <div className="h-dvh relative">
      <LoginCard />
    </div>
  )
}
