import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, HeadContent } from '@tanstack/react-router'

import { AppSidebar } from '#/components/layout/sidebar/app-sidebar'
import { Providers } from '#/components/provider'
import { SidebarInset } from '#/components/ui/sidebar'
import { createMetadata } from '#/lib/metadata'

import { Footer } from '../components/layout/footer'
import { Header } from '../components/layout/header'
import appCss from '../styles.css?url'

interface MyRouterContext {
  queryClient: QueryClient
}

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...createMetadata(),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased">
        <Providers>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <main className="container mx-auto max-w-full min-w-0 flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </Providers>
      </body>
    </html>
  )
}
