// app/providers.tsx
'use client'

import {NextUIProvider} from '@nextui-org/react'


export function Providers({children, pageProps}: { children: React.ReactNode, pageProps:any }) {
  return (
    <NextUIProvider>
     
      {children}
     
    </NextUIProvider>
  )
}