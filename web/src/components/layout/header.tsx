import { Link } from '@tanstack/react-router'
import { Beer } from 'lucide-react'

import { ThemeToggler } from './theme-toggler'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b px-4 backdrop-blur-lg">
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm no-underline shadow-[0_8px_24px_rgba(30,90,72,0.08)] sm:px-4 sm:py-2"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            Brew Monitor <Beer />
          </Link>
        </h2>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-0 sm:w-auto sm:flex-nowrap sm:pb-0">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Home
          </Link>
          <Link
            to="/beers"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Cervejas
          </Link>
          <Link
            to="/tanks"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Tanques
          </Link>
          <Link
            to="/batches"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Lotes
          </Link>
          <Link
            to="/fermentation-records"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Fermentação
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggler />
        </div>
      </nav>
    </header>
  )
}
