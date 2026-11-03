import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { relations } from '../data'
import { getEntity, getSourcesFor, normalize } from '../data/queries'
import type { EntityType, RelationKind } from '../data/types'
import { entitySerial, formatSpan, relationLabel, typeLabel } from '../format'
import { downloadRegistryPdf } from '../pdf'
import { usePageTitle } from '../usePageTitle'

const kinds: RelationKind[] = ['propiedad', 'control', 'participación', 'afiliación', 'operación']
const entityTypes: EntityType[] = ['grupo', 'medio', 'empresa', 'persona', 'estado']

export function Registry() {
  usePageTitle('Registro de propiedad')
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<'all' | RelationKind>('all')
  const [type, setType] = useState<'all' | EntityType>('all')

  const rows = useMemo(() => {
    const needle = normalize(query)
    return relations
      .filter((relation) => {
        const owner = getEntity(relation.owner)
        const owned = getEntity(relation.owned)
        if (!owner || !owned) return false
        if (kind !== 'all' && relation.kind !== kind) return false
        if (type !== 'all' && owned.type !== type) return false
        if (!needle) return true
        return (
          normalize(`${owner.name} ${owned.name} ${owner.aliases?.join(' ') ?? ''} ${owned.aliases?.join(' ') ?? ''}`).includes(
            needle,
          )
        )
      })
      .sort((a, b) => {
        const ownerA = getEntity(a.owner)?.name ?? ''
        const ownerB = getEntity(b.owner)?.name ?? ''
        return ownerA.localeCompare(ownerB) || a.id.localeCompare(b.id)
      })
  }, [query, kind, type])

  return (
    <div className="page">
      <section className="page-head shell">
        <p className="eyebrow">REGISTRO / TODAS LAS RELACIONES</p>
        <h1 className="page-title">El libro de propiedad</h1>
        <p className="page-lede">
          Cada fila es un vínculo documentado entre un propietario y una entidad. Una relación no
          equivale a control total: revise el tipo de vínculo, la participación y la fecha.
        </p>
      </section>

      <section className="shell section section--tight">
        <div className="filters paper">
          <label className="field">
            <span>Buscar</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Propietario o propiedad…"
            />
          </label>
          <label className="field">
            <span>Vínculo</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as 'all' | RelationKind)}>
              <option value="all">Todos</option>
              {kinds.map((item) => (
                <option key={item} value={item}>
                  {relationLabel[item]}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Tipo de propiedad</span>
            <select value={type} onChange={(event) => setType(event.target.value as 'all' | EntityType)}>
              <option value="all">Todos</option>
              {entityTypes.map((item) => (
                <option key={item} value={item}>
                  {typeLabel[item]}
                </option>
              ))}
            </select>
          </label>
          <div className="filters__count">
            <strong>{rows.length}</strong>
            <span>vínculos</span>
          </div>
        </div>

        <div className="registry-actions">
          <p className="fine-print">
            Descargue la vista filtrada como PDF; incluye tipo de vínculo, fechas y número de
            fuentes.
          </p>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => void downloadRegistryPdf(rows)}
            disabled={!rows.length}
          >
            Descargar PDF de esta vista
          </button>
        </div>

        <div className="ledger paper">
          <div className="ledger__head" aria-hidden="true">
            <span>Propietario</span>
            <span />
            <span>Propiedad</span>
            <span>Vínculo</span>
            <span>Fechas</span>
            <span>Fuentes</span>
          </div>
          {rows.map((relation) => {
            const owner = getEntity(relation.owner)
            const owned = getEntity(relation.owned)
            if (!owner || !owned) return null
            return (
              <div className="ledger__row" key={relation.id}>
                <div className="ledger__party">
                  <Link to={`/expediente/${owner.id}`}>{owner.name}</Link>
                  <span>{typeLabel[owner.type]} · {entitySerial(owner.id)}</span>
                </div>
                <span className="ledger__arrow" aria-hidden="true">
                  →
                </span>
                <div className="ledger__party">
                  <Link to={`/expediente/${owned.id}`}>{owned.name}</Link>
                  <span>{typeLabel[owned.type]}</span>
                </div>
                <div className="ledger__kind">
                  <span className={`tag ${relation.kind === 'control' ? 'tag--red' : ''}`}>
                    {relationLabel[relation.kind]}
                  </span>
                  <span>{relation.stake ?? 'No divulgada'}</span>
                </div>
                <div className="ledger__dates">
                  <span>{formatSpan(relation)}</span>
                  {relation.until ? <span className="tag tag--ghost">Cerrado</span> : null}
                </div>
                <div className="ledger__sources">
                  <span>{getSourcesFor(relation).length} fuentes</span>
                  {relation.note ? <span title={relation.note}>Nota</span> : null}
                </div>
              </div>
            )
          })}
        </div>

        {!rows.length ? (
          <div className="empty paper">
            <h2>Sin filas para ese filtro</h2>
            <p>Cambie el texto o vuelva a «Todos» para ver el registro completo.</p>
          </div>
        ) : null}
      </section>
    </div>
  )
}
