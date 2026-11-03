import { describe, expect, it } from 'vitest'
import { relations } from './data'
import { buildEntityPdfModel, buildRegistryPdfRows } from './pdf'

describe('modelos de PDF', () => {
  it('prepara la ficha de El Corral con cadena y fuentes', () => {
    const model = buildEntityPdfModel('el-corral')
    expect(model).not.toBeNull()
    expect(model?.entity.name).toBe('El Corral')
    expect(model?.chain.map((step) => step.entity.name)).toEqual([
      'El Corral',
      'Grupo Nutresa',
      'Grupo Gilinski',
      'Familia Gilinski',
    ])
    expect(model?.sources.length).toBeGreaterThan(0)
  })

  it('prepara la ficha del Grupo Semana con propiedades y fuentes', () => {
    const model = buildEntityPdfModel('grupo-semana')
    expect(model?.properties.map((item) => item.entity.name)).toContain('Dinero')
    expect(model?.chain.map((step) => step.entity.name)).toEqual([
      'Grupo Semana',
      'Grupo Gilinski',
      'Familia Gilinski',
    ])
    expect(model?.sources.length).toBeGreaterThan(0)
  })

  it('devuelve null para una entidad inexistente', () => {
    expect(buildEntityPdfModel('no-existe')).toBeNull()
  })

  it('prepara el registro filtrado y lo ordena por propietario', () => {
    const rows = buildRegistryPdfRows(relations.filter((relation) => relation.owner === 'grupo-semana'))
    expect(rows.length).toBeGreaterThanOrEqual(5)
    expect(rows[0].owner.name).toBe('Grupo Semana')
    expect(rows.every((row) => row.sources.length > 0)).toBe(true)
  })
})
