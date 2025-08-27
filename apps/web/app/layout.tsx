import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/query-provider'
import { ThemeProvider } from '@/lib/theme-provider'
import { AppLayout } from '@/components/app-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkanOS - Personal Operating System',
  description: 'Digital brain and life optimization system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <QueryProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}