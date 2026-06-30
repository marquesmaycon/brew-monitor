'use client'

import { Link } from '@tanstack/react-router'
import {
  BeerIcon,
  ClipboardListIcon,
  ContainerIcon,
  HouseIcon,
  PackageIcon,
} from 'lucide-react'
import * as React from 'react'

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

const data = {
  user: {
    name: 'Brew Monitor',
    email: 'monitoramento de fermentacao',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: <HouseIcon />,
    },
    {
      title: 'Cervejas',
      url: '/beers',
      icon: <BeerIcon />,
    },
    {
      title: 'Tanques',
      url: '/tanks',
      icon: <ContainerIcon />,
    },
    {
      title: 'Registros',
      url: '/fermentation-records',
      icon: <ClipboardListIcon />,
    },
    {
      title: 'Lotes',
      url: '/batches',
      icon: <PackageIcon />,
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
                  <span className="truncate text-xs">Fermentacao</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
