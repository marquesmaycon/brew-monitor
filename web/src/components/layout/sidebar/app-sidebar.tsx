'use client'

import { Link } from '@tanstack/react-router'
import { BookOpenTextIcon, ExternalLinkIcon } from 'lucide-react'
import * as React from 'react'

import BatchIcon from '@/assets/icons/batch.svg?react'
import BeerIcon from '@/assets/icons/beer.svg?react'
import DashboardIcon from '@/assets/icons/dashboard.svg?react'
import RecordIcon from '@/assets/icons/record.svg?react'
import TankIcon from '@/assets/icons/tank.svg?react'
import { NavMain } from '#/components/layout/sidebar/nav-main'
import { NavUser } from '#/components/layout/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar.tsx'

const apiDocumentationUrl = new URL(
  '/scalar/v1',
  import.meta.env.VITE_API_URL ?? 'http://localhost:5027',
).toString()

const data = {
  user: {
    name: 'Brew Monitor',
    email: 'admin@brewmonitor.com',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: <DashboardIcon />,
    },
    {
      title: 'Cervejas',
      url: '/beers',
      icon: <BeerIcon />,
    },
    {
      title: 'Tanques',
      url: '/tanks',
      icon: <TankIcon />,
    },
    {
      title: 'Registros',
      url: '/fermentation-records',
      icon: <RecordIcon />,
    },
    {
      title: 'Lotes',
      url: '/batches',
      icon: <BatchIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <img
                    src="/logo-white.svg"
                    alt="Brew Monitor"
                    className="size-8 shrink-0 object-contain"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Brew Monitor</span>
                  <span className="truncate text-xs">Fermentação</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href={apiDocumentationUrl} target="_blank" rel="noreferrer">
                <BookOpenTextIcon />
                <span>Documentação da API</span>
                <ExternalLinkIcon className="ml-auto size-3.5" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
