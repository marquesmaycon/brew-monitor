'use client'

import { Link } from '@tanstack/react-router'
import {
  Beer,
  BookOpenTextIcon,
  ClipboardList,
  Container,
  ExternalLinkIcon,
  LayoutDashboard,
  Package,
} from 'lucide-react'
import * as React from 'react'

import Logo from '@/assets/logo.svg?react'
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
      icon: <LayoutDashboard />,
    },
    {
      title: 'Cervejas',
      url: '/beers',
      icon: <Beer />,
    },
    {
      title: 'Tanques',
      url: '/tanks',
      icon: <Container />,
    },
    {
      title: 'Registros',
      url: '/fermentation-records',
      icon: <ClipboardList />,
    },
    {
      title: 'Lotes',
      url: '/batches',
      icon: <Package />,
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
                  <Logo
                    className="size-8! min-h-8 min-w-8 shrink-0 text-white"
                    aria-hidden
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
