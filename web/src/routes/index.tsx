import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <div className="page-wrap px-4 pt-14 pb-8"></div>
}
