// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
import { useSession } from 'next-auth/react';

export function Providers({children, pageProps}: { children: React.ReactNode, pageProps:any }) {
  return (
    <NextUIProvider>
     
      {children}
     
    </NextUIProvider>
  )
}