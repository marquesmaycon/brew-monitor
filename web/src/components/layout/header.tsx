import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'
import { ThemeToggler } from './theme-toggler'

export function Header() {
  return (
    <header className="bg-sidebar sticky top-0 z-50 h-(--header-height) shrink-0">
      <div className="flex h-full items-center gap-2 rounded-t-2xl border-b bg-white px-4 dark:bg-slate-800">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mt-6 mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Build Your Application</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto">
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}
