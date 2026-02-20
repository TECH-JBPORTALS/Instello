'use client'

import { Toaster } from '@instello/ui/components/sonner'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type * as React from 'react'
import { TRPCReactProvider } from '@/trpc/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <TRPCReactProvider>
        {children}
        <Toaster />
      </TRPCReactProvider>
    </NextThemesProvider>
  )
}
