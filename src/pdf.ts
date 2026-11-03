import type { jsPDF } from 'jspdf'
import {
  DATA_CUTOFF,
  relations,
} from './data'
import {
  getChain,
  getEntity,
  getHistory,
  getProperties,
  getSource,
  getSourcesFor,
} from './data/queries'
import type { Entity, Relation, Source } from './data/types'
import { entitySerial, formatDate, formatSpan, mediaKindLabel, relationLabel, typeLabel } from './format'

const PAPER: [number, number, number] = [233, 222, 197]
const INK: [number, number, number] = [23, 24, 16]
const RED: [number, number, number] = [169, 52, 39]
const MUTED: [number, number, number] = [78, 76, 62]
const PAGE_W = 210
const PAGE_H = 297
const MARGIN = 16
const CONTENT_W = PAGE_W - MARGIN * 2

export interface EntityPdfModel {
  entity: Entity
  chain: { entity: Entity; relation?: Relation }[]
  properties: { entity: Entity; relation: Relation }[]
  history: Relation[]
  sources: Source[]
  cutoff: string
}

export interface RegistryPdfRow {
  owner: Entity
  owned: Entity
  relation: Relation
  sources: Source[]
}

export function buildEntityPdfModel(id: string): EntityPdfModel | null {
  const entity = getEntity(id)
  if (!entity) return null

  const properties = getProperties(id)
    .map((relation) => {
      const property = getEntity(relation.owned)
      return property ? { entity: property, relation } : null
    })
    .filter((item): item is { entity: Entity; relation: Relation } => Boolean(item))

  const sourceIds = relations
    .filter((relation) => relation.owner === id || relation.owned === id)
    .flatMap((relation) => relation.sourceIds)
  const sources = [...new Set(sourceIds)]
    .map((sourceId) => getSource(sourceId))
    .filter((source): source is Source => Boolean(source))

  return {
    entity,
    chain: getChain(id).map((step) => ({ entity: step.entity, relation: step.relation })),
    properties,
    history: getHistory(id),
    sources,
    cutoff: DATA_CUTOFF,
  }
}

export function buildRegistryPdfRows(input: Relation[]): RegistryPdfRow[] {
  return input
    .map((relation) => {
      const owner = getEntity(relation.owner)
      const owned = getEntity(relation.owned)
      if (!owner || !owned) return null
      return { owner, owned, relation, sources: getSourcesFor(relation) }
    })
    .filter((row): row is RegistryPdfRow => Boolean(row))
    .sort((a, b) => a.owner.name.localeCompare(b.owner.name) || a.owned.name.localeCompare(b.owned.name))
}

function paintPage(doc: jsPDF) {
  doc.setFillColor(...PAPER);
  doc.rect(0, 0, PAGE_W, PAGE_H, 'F')
  doc.setFillColor(...INK)
  doc.rect(0, 0, PAGE_W, 9, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...PAPER)
  doc.text('WHOM · REGISTRO DE PROPIEDAD DE MEDIOS', MARGIN, 5.6)
  doc.text(`CORTE ${formatDate(DATA_CUTOFF).toUpperCase()}`, PAGE_W - MARGIN, 5.6, { align: 'right' })
}

function newPage(doc: jsPDF): number {
  doc.addPage()
  paintPage(doc)
  return 22
}

function ensure(doc: jsPDF, y: number, needed: number): number {
  return y + needed > PAGE_H - 24 ? newPage(doc) : y
}

function section(doc: jsPDF, title: string, y: number): number {
  const top = ensure(doc, y, 10)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...RED)
  doc.text(title.toUpperCase(), MARGIN, top)
  doc.setDrawColor(...RED)
  doc.setLineWidth(0.35)
  doc.line(MARGIN, top + 1.5, MARGIN + 26, top + 1.5)
  return top + 6.5
}

function paragraph(
  doc: jsPDF,
  text: string,
  y: number,
  size = 9,
  color: [number, number, number] = INK,
  width = CONTENT_W,
): number {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(size)
  doc.setTextColor(...color)
  const lines = doc.splitTextToSize(text, width) as string[]
  const start = ensure(doc, y, lines.length * size * 0.46 + 2)
  doc.text(lines, MARGIN, start)
  return start + lines.length * size * 0.46 + 2
}

function labelValue(doc: jsPDF, label: string, value: string, y: number): number {
  const start = ensure(doc, y, 6.5)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...MUTED)
  doc.text(label.toUpperCase(), MARGIN, start)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...INK)
  const lines = doc.splitTextToSize(value, CONTENT_W - 42) as string[]
  doc.text(lines, MARGIN + 42, start)
  return start + Math.max(5, lines.length * 3.8) + 0.8
}

function footer(doc: jsPDF) {
  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6)
    doc.setTextColor(...MUTED)
    doc.text('WHOM · Registro abierto de propiedad de medios · No es una entidad estatal', MARGIN, PAGE_H - 10)
    doc.text(`${page} / ${pages}`, PAGE_W - MARGIN, PAGE_H - 10, { align: 'right' })
  }
}

function drawEntity(doc: jsPDF, model: EntityPdfModel) {
  paintPage(doc)
  const { entity } = model

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...RED)
  doc.text(`EXPEDIENTE ${entitySerial(entity.id)} · DOCUMENTO PÚBLICO`, MARGIN, 22)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(27)
  doc.setTextColor(...INK)
  const nameLines = doc.splitTextToSize(entity.name.toUpperCase(), CONTENT_W) as string[]
  doc.text(nameLines, MARGIN, 32)
  let y = 32 + nameLines.length * 9.6 + 1

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...RED)
  doc.text(
    `${typeLabel[entity.type]}${entity.mediaKind ? ` · ${mediaKindLabel[entity.mediaKind]}` : ''}`,
    MARGIN,
    y,
  )
  y += 7

  y = paragraph(doc, entity.summary, y, 9, MUTED)
  y += 1

  if (entity.sector) y = labelValue(doc, 'Sector', entity.sector, y)
  if (entity.founded) y = labelValue(doc, 'Fundación', entity.founded, y)
  if (entity.headquarters) y = labelValue(doc, 'Sede', entity.headquarters, y)
  if (entity.website) y = labelValue(doc, 'Sitio', entity.website, y)

  const directOwner = model.chain[1]?.entity
  const ultimate = model.chain.at(-1)?.entity
  if (directOwner) y = labelValue(doc, 'Dueño directo', directOwner.name, y)
  if (ultimate && ultimate.id !== directOwner?.id) y = labelValue(doc, 'Control último', ultimate.name, y)

  y += 3
  y = section(doc, 'Cadena de propiedad', y)
  model.chain.forEach((step, index) => {
    const start = ensure(doc, y, 9)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8.5)
    doc.setTextColor(...INK)
    doc.text(`${String(index + 1).padStart(2, '0')}  ${step.entity.name}`, MARGIN, start)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(...MUTED)
    doc.text(typeLabel[step.entity.type].toUpperCase(), PAGE_W - MARGIN, start, { align: 'right' })
    y = start + 4.2
    if (step.relation && index < model.chain.length - 1) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7)
      doc.setTextColor(...RED)
      doc.text(
        `${relationLabel[step.relation.kind]}${step.relation.stake ? ` · ${step.relation.stake}` : ''} ->`,
        MARGIN + 6,
        y,
      )
      y += 4
    }
  })

  if (model.properties.length) {
    y += 2
    y = section(doc, 'Propiedades directas', y)
    model.properties.forEach((item) => {
      const start = ensure(doc, y, 8)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(...INK)
      doc.text(item.entity.name, MARGIN, start)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.setTextColor(...MUTED)
      const detail = `${relationLabel[item.relation.kind]}${item.relation.stake ? ` · ${item.relation.stake}` : ''} · ${typeLabel[item.entity.type]}`
      doc.text(detail, PAGE_W - MARGIN, start, { align: 'right' })
      y = start + 4.5
    })
  }

  if (model.history.length) {
    y += 2
    y = section(doc, 'Historial', y)
    model.history.forEach((relation) => {
      const start = ensure(doc, y, 8)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(...INK)
      const owner = getEntity(relation.owner)?.name ?? relation.owner
      const owned = getEntity(relation.owned)?.name ?? relation.owned
      doc.text(`${owner} -> ${owned}`, MARGIN, start)
      doc.setTextColor(...MUTED)
      doc.setFontSize(6.5)
      doc.text(`${formatSpan(relation)} · ${relationLabel[relation.kind]}`, PAGE_W - MARGIN, start, {
        align: 'right',
      })
      y = start + 4.5
    })
  }

  y += 2
  y = section(doc, 'Fuentes', y)
  model.sources.forEach((source, index) => {
    const start = ensure(doc, y, 10)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...INK)
    const titleLines = doc.splitTextToSize(`${String(index + 1).padStart(2, '0')}  ${source.title}`, CONTENT_W) as string[]
    doc.text(titleLines, MARGIN, start)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.2)
    doc.setTextColor(...MUTED)
    const meta = `${source.publisher} · ${formatDate(source.date)} · ${source.kind}`
    doc.text(meta, MARGIN, start + titleLines.length * 3.2)
    doc.text(source.url, MARGIN, start + titleLines.length * 3.2 + 3)
    y = start + titleLines.length * 3.2 + 7
    if (y > PAGE_H - 28) y = newPage(doc)
  })

  y += 2
  y = ensure(doc, y, 12)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.5)
  doc.setTextColor(...MUTED)
  const note =
    'Este documento describe propiedad documentada, no control editorial ni intención política. La propiedad cambia: revise la fecha de corte y las fuentes.'
  doc.text(doc.splitTextToSize(note, CONTENT_W) as string[], MARGIN, y)
}

function drawRegistry(doc: jsPDF, rows: RegistryPdfRow[]) {
  paintPage(doc)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...RED)
  doc.text('REGISTRO / RELACIONES FILTRADAS', MARGIN, 22)
  doc.setFontSize(24)
  doc.setTextColor(...INK)
  doc.text('Libro de propiedad', MARGIN, 33)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MUTED)
  doc.text(`${rows.length} vínculos · corte ${formatDate(DATA_CUTOFF)}`, MARGIN, 39)
  let y = 47

  rows.forEach((row, index) => {
    const start = ensure(doc, y, 15)
    doc.setDrawColor(...MUTED)
    doc.setLineWidth(0.15)
    doc.line(MARGIN, start - 2.5, PAGE_W - MARGIN, start - 2.5)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...INK)
    doc.text(`${String(index + 1).padStart(2, '0')}  ${row.owner.name} -> ${row.owned.name}`, MARGIN, start)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.3)
    doc.setTextColor(...MUTED)
    doc.text(
      `${relationLabel[row.relation.kind]} · ${row.relation.stake ?? 'participación no divulgada'} · ${formatSpan(row.relation)} · ${row.sources.length} fuentes`,
      MARGIN + 6,
      start + 3.8,
    )
    y = start + 8
  })

  y += 3
  y = ensure(doc, y, 12)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.5)
  doc.setTextColor(...MUTED)
  doc.text(
    doc.splitTextToSize(
      'Los vínculos describen propiedad y control documentados. No equivalen a control editorial ni a una calificación de los medios.',
      CONTENT_W,
    ) as string[],
    MARGIN,
    y,
  )
}

function slug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export async function downloadEntityPdf(id: string): Promise<void> {
  const model = buildEntityPdfModel(id)
  if (!model) return
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  drawEntity(doc, model)
  footer(doc)
  doc.save(`whom-${slug(model.entity.name)}.pdf`)
}

export async function downloadRegistryPdf(input: Relation[]): Promise<void> {
  const rows = buildRegistryPdfRows(input)
  if (!rows.length) return
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  drawRegistry(doc, rows)
  footer(doc)
  doc.save('whom-registro.pdf')
}
