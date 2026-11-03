import { describe, expect, it } from 'vitest'
import { entities, relations, sources, timeline } from './index'
import {
  countTreeNodes,
  getChain,
  getDirectOwner,
  getGroups,
  getProperties,
  getTree,
  getTreePath,
  getUltimateGroup,
  isActive,
  search,
} from './queries'

describe('integridad del registro', () => {
  it('no repite identificadores', () => {
    expect(new Set(entities.map((entity) => entity.id)).size).toBe(entities.length)
    expect(new Set(relations.map((relation) => relation.id)).size).toBe(relations.length)
    expect(new Set(sources.map((source) => source.id)).size).toBe(sources.length)
  })

  it('todas las relaciones apuntan a entidades existentes', () => {
    const ids = new Set(entities.map((entity) => entity.id))
    for (const relation of relations) {
      expect(ids.has(relation.owner), `${relation.id} owner`).toBe(true)
      expect(ids.has(relation.owned), `${relation.id} owned`).toBe(true)
      expect(relation.owner).not.toBe(relation.owned)
    }
  })

  it('toda relación cita al menos una fuente existente', () => {
    const ids = new Set(sources.map((source) => source.id))
    for (const relation of relations) {
      expect(relation.sourceIds.length, relation.id).toBeGreaterThan(0)
      for (const sourceId of relation.sourceIds) {
        expect(ids.has(sourceId), `${relation.id} -> ${sourceId}`).toBe(true)
      }
    }
  })

  it('todo medio tiene un propietario actual', () => {
    for (const entity of entities.filter((item) => item.type === 'medio')) {
      expect(getDirectOwner(entity.id), entity.name).toBeDefined()
    }
  })

  it('cada entidad tiene un solo dueño principal activo', () => {
    for (const relation of relations.filter((item) => item.principal && isActive(item))) {
      const principals = relations.filter(
        (item) => item.owned === relation.owned && item.principal && isActive(item),
      )
      expect(principals, relation.owned).toHaveLength(1)
    }
  })

  it('la línea de tiempo y sus fuentes existen', () => {
    const sourceIds = new Set(sources.map((source) => source.id))
    const entityIds = new Set(entities.map((entity) => entity.id))
    for (const event of timeline) {
      expect(event.sourceIds.length).toBeGreaterThan(0)
      for (const id of event.sourceIds) expect(sourceIds.has(id), event.title).toBe(true)
      for (const id of event.entityIds) expect(entityIds.has(id), event.title).toBe(true)
    }
  })

  it('cada grupo tiene al menos una propiedad', () => {
    for (const group of entities.filter((entity) => entity.type === 'grupo')) {
      expect(getProperties(group.id).length, group.name).toBeGreaterThan(0)
    }
  })
})

describe('cadenas de propiedad', () => {
  it('El Corral llega hasta la familia Gilinski pasando por Nutresa', () => {
    expect(getChain('el-corral').map((step) => step.entity.name)).toEqual([
      'El Corral',
      'Grupo Nutresa',
      'Grupo Gilinski',
      'Familia Gilinski',
    ])
  })

  it('Semana llega a Gilinski a través del Grupo Semana', () => {
    expect(getChain('semana').map((step) => step.entity.name)).toEqual([
      'Semana',
      'Grupo Semana',
      'Grupo Gilinski',
      'Familia Gilinski',
    ])
  })

  it('Caracol Televisión y Caracol Radio tienen dueños distintos', () => {
    expect(getChain('caracol-tv').map((step) => step.entity.name)).toEqual([
      'Caracol Televisión',
      'Valórem',
      'Familia Santo Domingo',
    ])
    expect(getChain('caracol-radio').map((step) => step.entity.name)).toEqual([
      'Caracol Radio',
      'PRISA',
    ])
  })

  it('El País ya no pertenece a Gilinski', () => {
    expect(getChain('el-pais').map((step) => step.entity.name)).toEqual([
      'El País',
      'Eduardo Hernández Incháustegui',
    ])
  })

  it('El Espectador sigue vinculado a Valórem', () => {
    expect(getChain('el-espectador').map((step) => step.entity.name)).toEqual([
      'El Espectador',
      'Valórem',
      'Familia Santo Domingo',
    ])
  })

  it('El Tiempo llega a la familia Sarmiento', () => {
    expect(getChain('el-tiempo').map((step) => step.entity.name)).toEqual([
      'El Tiempo',
      'Grupo Aval',
      'Familia Sarmiento',
    ])
  })

  it('El grupo último de El Corral es Gilinski', () => {
    expect(getUltimateGroup('el-corral')?.name).toBe('Grupo Gilinski')
  })

  it('el grupo de El Colombiano llega a la familia Gómez Martínez', () => {
    expect(getChain('el-colombiano').map((step) => step.entity.name)).toEqual([
      'El Colombiano',
      'Grupo El Colombiano',
      'Familia Gómez Martínez',
    ])
  })

  it('Vanguardia pertenece a la familia Galvis', () => {
    expect(getChain('vanguardia').map((step) => step.entity.name)).toEqual([
      'Vanguardia',
      'Grupo Vanguardia',
      'Familia Galvis',
    ])
  })

  it('los grupos están ordenados por posición', () => {
    const groups = getGroups()
    expect(groups[0].name).toBe('Organización Ardila Lülle')
    expect(groups[0].rank).toBe(1)
    expect(groups.map((group) => group.rank)).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(groups.map((group) => group.id)).toContain('grupo-el-colombiano')
    expect(groups.map((group) => group.id)).toContain('grupo-vanguardia')
  })

  it('el árbol de El Corral se enraíza en la familia Gilinski', () => {
    const tree = getTree('el-corral')
    expect(tree?.entity.name).toBe('Familia Gilinski')
    expect(countTreeNodes(tree!)).toBeGreaterThan(10)
    expect(getTreePath('el-corral')).toEqual([
      'el-corral',
      'nutresa',
      'gilinski',
      'familia-gilinski',
    ])
  })
})

describe('búsqueda', () => {
  it('encuentra por nombre sin importar tildes', () => {
    expect(search('corral')[0].id).toBe('el-corral')
    expect(search('valorem')[0].id).toBe('valorem')
    expect(search('PRISA')[0].id).toBe('prisa')
  })

  it('encuentra por alias', () => {
    expect(search('canal rcn')[0].id).toBe('rcn-tv')
    expect(search('gaseosas postobon')[0].id).toBe('postobon')
  })

  it('devuelve vacío con una consulta vacía', () => {
    expect(search('   ')).toEqual([])
  })
})
