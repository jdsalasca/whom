import type { EntityType, MediaKind, Relation, RelationKind } from './data/types'

export const typeLabel: Record<EntityType, string> = {
  grupo: 'Grupo',
  medio: 'Medio',
  empresa: 'Empresa',
  persona: 'Persona / familia',
  estado: 'Entidad pública',
}

export const mediaKindLabel: Record<MediaKind, string> = {
  televisión: 'Televisión',
  radio: 'Radio',
  prensa: 'Prensa',
  revista: 'Revista',
  digital: 'Digital',
}

export const relationLabel: Record<RelationKind, string> = {
  propiedad: 'Propiedad',
  control: 'Control',
  participación: 'Participación',
  afiliación: 'Afiliación',
  operación: 'Operación',
}

const months = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
]

export function formatDate(value?: string): string {
  if (!value) return '—'
  const [year, month, day] = value.slice(0, 10).split('-')
  if (!year || !month) return value
  if (!day) return `${months[Number(month) - 1] ?? month} ${year}`
  return `${Number(day)} ${months[Number(month) - 1] ?? month} ${year}`
}

export function formatSpan(relation: Relation): string {
  if (relation.since && relation.until) {
    return `${formatDate(relation.since)} — ${formatDate(relation.until)}`
  }
  if (relation.since) return `Desde ${formatDate(relation.since)}`
  if (relation.until) return `Hasta ${formatDate(relation.until)}`
  return 'Sin fecha pública'
}

export function entitySerial(id: string): string {
  let hash = 0
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1679616
  return `WH-${hash.toString(36).toUpperCase().padStart(4, '0')}`
}

export function relationTone(relation: Relation): string {
  if (relation.kind === 'control') return 'red'
  if (relation.kind === 'afiliación' || relation.kind === 'participación') return 'olive'
  return 'ink'
}
