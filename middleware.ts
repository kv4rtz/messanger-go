import { url as URL } from './store/api/config'
import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')
  const url = req.url
  const domain = url.split('/')[2]
  const sertificate = url.split('/')[0].slice(0, -1)
  const rootUrl = `${sertificate}://${domain}/`

  try {
    const verified = await fetch(URL + '/auth/check', {
      headers: {
        Authorization: `Bearer ${token?.value}`,
      },
      mode: 'cors',
    })

    if (verified.status === 200 && url === rootUrl) {
      return NextResponse.redirect(`${rootUrl}lk`)
    }

    if (url.includes('/lk') && verified.status !== 200) {
      return NextResponse.redirect(`${rootUrl}`)
    }
  } catch (err) {
    return NextResponse.redirect(`${rootUrl}`)
  }
}
