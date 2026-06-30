import { TanStackDevtools } from '@tanstack/react-devtools'
import { Scripts } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import type React from 'react'
import { Toaster } from 'sonner'

import { SidebarProvider } from '#/components/ui/sidebar'
import { TooltipProvider } from '#/components/ui/tooltip'

import TanStackQueryDevtools from '../lib/tanstack-devtools'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        {children}
        <Toaster richColors />
      </SidebarProvider>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      />
      <Scripts />
    </TooltipProvider>
  )
}
