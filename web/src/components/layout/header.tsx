import { Separator } from '../ui/separator'
import { SidebarTrigger } from '../ui/sidebar'
import { AppBreadcrumb } from './breadcrumb'
import { ThemeToggler } from './theme-toggler'

export function Header() {
  return (
    <header className="md:bg-sidebar md:dark:bg-sidebar sticky top-0 z-50 h-(--header-height) shrink-0 bg-white dark:bg-slate-800">
      <div className="flex h-full items-center gap-2 rounded-t-2xl border-b bg-white px-4 dark:bg-slate-800">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mt-6 mr-2 data-[orientation=vertical]:h-4"
        />
        <AppBreadcrumb />

        <div className="ml-auto">
          <ThemeToggler />
        </div>
      </div>
    </header>
  )
}
