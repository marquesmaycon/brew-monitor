import { Link, useLocation } from '@tanstack/react-router'
import type * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '#/components/ui/sidebar.tsx'

type NavMainItem = {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const pathname = useLocation({
    select: (location) => location.pathname,
  })
  const { setOpenMobile } = useSidebar()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map(({ title, url, icon }) => {
          const isActive = pathname === url || pathname.startsWith(`${url}/`)
          return (
            <SidebarMenuItem key={title}>
              <SidebarMenuButton asChild isActive={isActive}>
                <Link to={url} onClick={() => setOpenMobile(false)}>
                  {icon}
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
