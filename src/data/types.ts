export type EntityType = 'grupo' | 'medio' | 'empresa' | 'persona' | 'estado'
export type MediaKind = 'televisión' | 'radio' | 'prensa' | 'revista' | 'digital'
export type GroupTier = 'nacional' | 'regional' | 'público'
export type RelationKind =
  | 'propiedad'
  | 'control'
  | 'participación'
  | 'afiliación'
  | 'operación'

export interface Entity {
  id: string
  name: string
  type: EntityType
  mediaKind?: MediaKind
  sector?: string
  summary: string
  aliases?: string[]
  founded?: string
  headquarters?: string
  website?: string
  status?: 'activo' | 'integrado' | 'histórico'
  rank?: number
  tier?: GroupTier
}

export interface Relation {
  id: string
  owner: string
  owned: string
  kind: RelationKind
  stake?: string
  since?: string
  until?: string
  note?: string
  principal?: boolean
  sourceIds: string[]
}

export interface Source {
  id: string
  title: string
  publisher: string
  url: string
  date: string
  kind: 'oficial' | 'prensa' | 'investigación'
}

export interface TimelineEvent {
  date: string
  title: string
  detail: string
  entityIds: string[]
  sourceIds: string[]
}

export const DATA_CUTOFF = '2026-11-02'
