import { entities } from './entities'
import { relations } from './relations'
import { sources } from './sources'
import { timeline } from './timeline'
import type { Entity, Relation, Source } from './types'

export { entities, relations, sources, timeline }
export * from './types'

export const entityById = new Map<string, Entity>(entities.map((entity) => [entity.id, entity]))
export const sourceById = new Map<string, Source>(sources.map((source) => [source.id, source]))
export const relationById = new Map<string, Relation>(relations.map((relation) => [relation.id, relation]))
