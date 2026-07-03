import { useRouter } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'

import { cn } from '#/lib/utils'

import type { ButtonProps } from './ui/button'
import { Button } from './ui/button'

function PageHeader({
  className,
  children,
  ...props
}: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {children}
    </div>
  )
}

function PageHeaderTitle({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:justify-between">
      <div className="mr-auto">
        <h1 className="font-heading text-2xl font-semibold tracking-normal md:text-3xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
      </div>
      {children}
    </div>
  )
}

function PageHeaderBackButton({
  className,
  variant = 'link',
  ...props
}: ButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant={variant}
      className={cn('px-0 text-xs font-medium md:text-sm', className)}
      onClick={() => router.history.back()}
      {...props}
    >
      <ArrowLeftIcon /> Voltar
    </Button>
  )
}

export { PageHeader, PageHeaderBackButton, PageHeaderTitle }
