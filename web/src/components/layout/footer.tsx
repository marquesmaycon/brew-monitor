export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t bg-white px-4 pt-10 pb-14">
      <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Your name here. All rights reserved.
        </p>
        <p className="island-kicker m-0">Built with TanStack Start 2</p>
      </div>
    </footer>
  )
}
