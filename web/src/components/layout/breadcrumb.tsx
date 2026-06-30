import { Link, useMatches } from '@tanstack/react-router'
import React from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const breadcrumbConfig: Record<string, string> = {
  tanks: 'Tanques',
  beers: 'Cervejas',
  'fermentation-records': 'Registros de fermentação',
  batches: 'Lotes',
  new: 'Novo',
  edit: 'Editar',
  parameters: 'Parâmetros',
}

type BreadcrumbLinkTo =
  | '/'
  | '/tanks'
  | '/beers'
  | '/fermentation-records'
  | '/batches'

type Crumb = {
  label: string
  to?: BreadcrumbLinkTo
}

type BreadcrumbData = {
  batchNumber?: string
  name?: string
  style?: string
}

const breadcrumbLinks: Partial<Record<string, BreadcrumbLinkTo>> = {
  tanks: '/tanks',
  beers: '/beers',
  'fermentation-records': '/fermentation-records',
  batches: '/batches',
}

function getPrimaryLoaderData(data: unknown): BreadcrumbData | undefined {
  const value = Array.isArray(data) ? data[0] : data

  if (!value || typeof value !== 'object') {
    return undefined
  }

  return value as BreadcrumbData
}

function getDynamicLabel(
  segment: string,
  segments: Array<string>,
  index: number,
  data?: unknown,
) {
  const parent = segments[index - 1]
  const loaderData = getPrimaryLoaderData(data)

  if (parent === 'batches') {
    return loaderData?.batchNumber ?? decodeURIComponent(segment)
  }

  if (parent === 'fermentation-records') {
    return loaderData?.batchNumber ?? decodeURIComponent(segment)
  }

  if (parent === 'beers') {
    return loaderData?.name ?? decodeURIComponent(segment)
  }

  if (parent === 'tanks') {
    return loaderData?.name ?? decodeURIComponent(segment)
  }

  return decodeURIComponent(segment)
}

function buildBreadcrumbs(pathname: string, data?: unknown): Array<Crumb> {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs: Array<Crumb> = [{ label: 'Início', to: '/' }]

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1
    const label = breadcrumbConfig[segment]

    if (label) {
      crumbs.push({
        label,
        to: !isLast ? breadcrumbLinks[segment] : undefined,
      })
      return
    }

    crumbs.push({
      label: getDynamicLabel(segment, segments, index, data),
    })
  })

  return crumbs
}

export function AppBreadcrumb() {
  const matches = useMatches()
  const lastMatch = matches[matches.length - 1]

  const crumbs = buildBreadcrumbs(lastMatch.pathname, lastMatch.loaderData)

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => (
          <React.Fragment key={`${crumb.label}-${index}`}>
            <BreadcrumbItem>
              {index < crumbs.length - 1 && crumb.to ? (
                <BreadcrumbLink asChild className="text-xs md:text-sm">
                  <Link to={crumb.to}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : index < crumbs.length - 1 ? (
                <span className="text-muted-foreground text-xs md:text-sm">
                  {crumb.label}
                </span>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>

            {index < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
