import { DATA_CUTOFF, entities, entityById, relations, sourceById } from './index'
import type { Entity, EntityType, Relation, Source } from './types'

export interface ChainStep {
  entity: Entity
  relation?: Relation
  owner?: Entity
}

const typeOrder: Record<EntityType, number> = {
  grupo: 0,
  medio: 1,
  empresa: 2,
  persona: 3,
  estado: 4,
}

export function isActive(relation: Relation, at = DATA_CUTOFF): boolean {
  return !relation.until || relation.until > at
}

export function getActiveRelations(): Relation[] {
  return relations.filter((relation) => isActive(relation))
}

export function getEntity(id: string): Entity | undefined {
  return entityById.get(id)
}

export function getSource(id: string): Source | undefined {
  return sourceById.get(id)
}

export function getSourcesFor(relation: Relation): Source[] {
  return relation.sourceIds
    .map((id) => sourceById.get(id))
    .filter((source): source is Source => Boolean(source))
}

export function getDirectOwners(id: string): Relation[] {
  return getActiveRelations()
    .filter((relation) => relation.owned === id)
    .sort((a, b) => Number(Boolean(b.principal)) - Number(Boolean(a.principal)))
}

export function getPrimaryOwnerRelation(id: string): Relation | undefined {
  const owners = getDirectOwners(id)
  return owners.find((relation) => relation.principal) ?? owners[0]
}

export function getDirectOwner(id: string): Entity | undefined {
  const relation = getPrimaryOwnerRelation(id)
  return relation ? entityById.get(relation.owner) : undefined
}

export function getProperties(id: string): Relation[] {
  return getActiveRelations()
    .filter((relation) => relation.owner === id)
    .sort((a, b) => {
      const aType = entityById.get(a.owned)?.type ?? 'empresa'
      const bType = entityById.get(b.owned)?.type ?? 'empresa'
      return typeOrder[aType] - typeOrder[bType] || a.owned.localeCompare(b.owned)
    })
}

export function getHistory(id: string): Relation[] {
  return relations
    .filter((relation) => (relation.owned === id || relation.owner === id) && relation.until)
    .sort((a, b) => (b.until ?? '').localeCompare(a.until ?? ''))
}

export function getChain(id: string): ChainStep[] {
  const chain: ChainStep[] = []
  const visited = new Set<string>()
  let current = entityById.get(id)

  while (current && !visited.has(current.id)) {
    visited.add(current.id)
    const relation = getPrimaryOwnerRelation(current.id)
    chain.push({
      entity: current,
      relation,
      owner: relation ? entityById.get(relation.owner) : undefined,
    })
    if (!relation) break
    current = entityById.get(relation.owner)
  }

  return chain
}

export function getUltimateGroup(id: string): Entity | undefined {
  return getChain(id)
    .map((step) => step.entity)
    .reverse()
    .find((entity) => entity.type === 'grupo')
}

export function getGroupMedia(groupId: string): Entity[] {
  return getProperties(groupId)
    .map((relation) => entityById.get(relation.owned))
    .filter((entity): entity is Entity => Boolean(entity) && entity?.type === 'medio')
}

export function getGroupBusinesses(groupId: string): Entity[] {
  return getProperties(groupId)
    .map((relation) => entityById.get(relation.owned))
    .filter((entity): entity is Entity => Boolean(entity) && entity?.type === 'empresa')
}

export function getSiblings(id: string): Entity[] {
  const relation = getPrimaryOwnerRelation(id)
  if (!relation) return []
  return getProperties(relation.owner)
    .filter((item) => item.owned !== id)
    .map((item) => entityById.get(item.owned))
    .filter((entity): entity is Entity => Boolean(entity))
}

export function getRelated(id: string): Entity[] {
  const related = new Map<string, Entity>()
  getChain(id).forEach((step) => {
    if (step.entity.id !== id) related.set(step.entity.id, step.entity)
  })
  getProperties(id).forEach((relation) => {
    const entity = entityById.get(relation.owned)
    if (entity) related.set(entity.id, entity)
  })
  getSiblings(id).forEach((entity) => related.set(entity.id, entity))
  return [...related.values()]
}

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function search(query: string, limit = 12): Entity[] {
  const needle = normalize(query)
  if (!needle) return []

  const scored = entities
    .map((entity) => {
      const name = normalize(entity.name)
      const aliases = (entity.aliases ?? []).map(normalize)
      let score = 0
      if (name === needle) score = 100
      else if (name.startsWith(needle)) score = 80
      else if (name.includes(needle)) score = 60
      else if (aliases.some((alias) => alias === needle)) score = 75
      else if (aliases.some((alias) => alias.startsWith(needle))) score = 55
      else if (aliases.some((alias) => alias.includes(needle))) score = 40
      else if (normalize(entity.summary).includes(needle)) score = 20
      return { entity, score }
    })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        typeOrder[a.entity.type] - typeOrder[b.entity.type] ||
        a.entity.name.localeCompare(b.entity.name),
    )

  return scored.slice(0, limit).map((item) => item.entity)
}

export function getMedia(): Entity[] {
  return entities
    .filter((entity) => entity.type === 'medio')
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getGroups(): Entity[] {
  return entities
    .filter((entity) => entity.type === 'grupo')
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99) || a.name.localeCompare(b.name))
}

export interface TreeBranch {
  entity: Entity
  relation?: Relation
  children: TreeBranch[]
}

export function getTreeRoot(id: string): Entity | undefined {
  return getChain(id).at(-1)?.entity
}

export function getTreePath(id: string): string[] {
  return getChain(id).map((step) => step.entity.id)
}

function buildBranch(id: string, seen: Set<string>, relation?: Relation): TreeBranch | undefined {
  const entity = entityById.get(id)
  if (!entity || seen.has(id)) return undefined
  const nextSeen = new Set(seen).add(id)
  const children = getProperties(id)
    .map((childRelation) => buildBranch(childRelation.owned, nextSeen, childRelation))
    .filter((branch): branch is TreeBranch => Boolean(branch))
  return { entity, relation, children }
}

export function getTree(id: string): TreeBranch | undefined {
  const root = getTreeRoot(id)
  return root ? buildBranch(root.id, new Set()) : undefined
}

export function getTreeForBranch(id: string): TreeBranch | undefined {
  return buildBranch(id, new Set())
}

export function countTreeNodes(branch: TreeBranch): number {
  return 1 + branch.children.reduce((total, child) => total + countTreeNodes(child), 0)
}

export function getBusinesses(): Entity[] {
  return entities
    .filter((entity) => entity.type === 'empresa')
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getPeople(): Entity[] {
  return entities
    .filter((entity) => entity.type === 'persona')
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function countByType(): Record<EntityType, number> {
  return entities.reduce(
    (acc, entity) => {
      acc[entity.type] += 1
      return acc
    },
    { grupo: 0, medio: 0, empresa: 0, persona: 0, estado: 0 } as Record<EntityType, number>,
  )
}

export function getMediaOfGroupByChain(groupId: string): Entity[] {
  return entities.filter((entity) => {
    if (entity.type !== 'medio') return false
    return getChain(entity.id).some((step) => step.entity.id === groupId)
  })
}
