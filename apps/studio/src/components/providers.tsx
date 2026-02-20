'use client'

import { Toaster } from '@instello/ui/components/sonner'
import { TooltipProvider } from '@instello/ui/components/tooltip'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type * as React from 'react'
import { useUploadLeaveGuard } from '@/hooks/useUploadLeaveGuard'
import { TRPCReactProvider } from '@/trpc/react'

export function Providers({ children }: { children: React.ReactNode }) {
  useUploadLeaveGuard()
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
      <NuqsAdapter>
        <TRPCReactProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </TRPCReactProvider>
      </NuqsAdapter>
    </NextThemesProvider>
  )
}
