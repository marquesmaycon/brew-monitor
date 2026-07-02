import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

type SonnerStyle = CSSProperties & Record<`--${string}`, string>

const Toaster = ({ ...props }: ToasterProps) => {
  const toastStyle: SonnerStyle = {
    '--normal-bg': 'oklch(1 0 0)',
    '--normal-text': 'var(--dark-blue)',
    '--normal-border': 'var(--mist-blue)',
    '--success-bg': 'color-mix(in oklab, var(--fresh-green) 35%, white)',
    '--success-border': 'var(--color-emerald-200)',
    '--success-text': 'var(--color-emerald-700)',
    '--warning-bg': 'color-mix(in oklab, var(--amber) 35%, white)',
    '--warning-border': 'var(--color-amber-200)',
    '--warning-text': 'var(--color-amber-700)',
    '--error-bg': 'color-mix(in oklab, var(--coral) 35%, white)',
    '--error-border': 'var(--color-red-600)',
    '--error-text': 'var(--color-red-700)',
    '--border-radius': 'var(--radius)',
  }

  return (
    <Sonner
      {...props}
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={toastStyle}
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
    />
  )
}

export { Toaster }
