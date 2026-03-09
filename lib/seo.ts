import type { Metadata } from 'next'

type PageMetadataInput = {
  title: string
  description: string
  path: string
  noindex?: boolean
}

function normalizePath(path: string): string {
  if (!path.startsWith('/')) return `/${path}`
  if (path !== '/' && path.endsWith('/')) return path.slice(0, -1)
  return path
}

export function canonicalFor(path: string): string {
  return normalizePath(path)
}

export function createPageMetadata({
  title,
  description,
  path,
  noindex = false,
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: canonicalFor(path),
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}
