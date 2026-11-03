import type { ReactNode } from 'react'

export function Stamp({
  children,
  tone = 'red',
  className = '',
}: {
  children: ReactNode
  tone?: 'red' | 'olive' | 'ink'
  className?: string
}) {
  return <span className={`stamp stamp--${tone} ${className}`}>{children}</span>
}
