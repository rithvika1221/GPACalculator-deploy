import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import {Providers} from "./providers";
import {NextUIProvider} from '@nextui-org/react'
import { SessionProvider } from 'next-auth/react'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}