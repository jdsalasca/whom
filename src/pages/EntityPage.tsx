import { Link, useParams } from 'react-router-dom'
import { Chain } from '../components/Chain'
import { EntityCard } from '../components/EntityCard'
import { OwnershipTree } from '../components/OwnershipTree'
import { SourceList } from '../components/SourceList'
import { Stamp } from '../components/Stamp'
import {
  getDirectOwner,
  getEntity,
  getHistory,
  getPrimaryOwnerRelation,
  getProperties,
  getSiblings,
  getTree,
  getUltimateGroup,
} from '../data/queries'
import { relations } from '../data'
import { downloadEntityPdf } from '../pdf'
import { DATA_CUTOFF } from '../data/types'
import {
  entitySerial,
  formatDate,
  formatSpan,
  mediaKindLabel,
  relationLabel,
  typeLabel,
} from '../format'
import { NotFound } from './NotFound'
import { usePageTitle } from '../usePageTitle'

export function EntityPage() {
  const { id } = useParams()
  const entity = id ? getEntity(id) : undefined
  usePageTitle(entity ? `${entity.name} · quién es el dueño` : 'Expediente no encontrado')

  if (!entity) return <NotFound />

  const ownerRelation = getPrimaryOwnerRelation(entity.id)
  const directOwner = getDirectOwner(entity.id)
  const ultimateGroup = getUltimateGroup(entity.id)
  const properties = getProperties(entity.id)
  const siblings = getSiblings(entity.id)
  const history = getHistory(entity.id)
  const tree = getTree(entity.id)
  const treeRoot = tree?.entity
  const sourceIds = relations
    .filter((relation) => relation.owner === entity.id || relation.owned === entity.id)
    .flatMap((relation) => relation.sourceIds)

  return (
    <div className="page">
      <div className="shell breadcrumb">
        <Link to="/registro">Registro</Link>
        <span aria-hidden="true">/</span>
        <span>{typeLabel[entity.type]}</span>
        <span aria-hidden="true">/</span>
        <span>{entity.name}</span>
      </div>

      <article className="dossier shell">
        <div className="dossier__bar">
          <span>EXPEDIENTE {entitySerial(entity.id)}</span>
          <span>CORTE {formatDate(DATA_CUTOFF)}</span>
          <span className="dossier__bar-strong">DOCUMENTO PÚBLICO</span>
        </div>

        <div className="dossier__grid">
          <header className="dossier__id">
            <div className="dossier__tags">
              <span className="tag">{typeLabel[entity.type]}</span>
              {entity.mediaKind ? <span className="tag tag--ghost">{mediaKindLabel[entity.mediaKind]}</span> : null}
              {entity.status ? <span className="tag tag--ghost">{entity.status}</span> : null}
            </div>
            <h1 className="dossier__name">{entity.name}</h1>
            {entity.aliases?.length ? (
              <p className="dossier__aliases">También conocido como: {entity.aliases.join(' · ')}</p>
            ) : null}
            <p className="dossier__summary">{entity.summary}</p>
            {entity.website ? (
              <a className="dossier__site" href={entity.website} target="_blank" rel="noreferrer">
                Sitio oficial ↗
              </a>
            ) : null}
            <div className="dossier__stamp">
              <Stamp tone={entity.type === 'medio' ? 'red' : 'olive'}>{typeLabel[entity.type]} registrado</Stamp>
            </div>
            <div className="dossier__actions">
              <button className="btn btn--ghost" type="button" onClick={() => void downloadEntityPdf(entity.id)}>
                Descargar PDF
              </button>
              {treeRoot ? (
                <Link className="btn btn--ghost" to={`/arbol?raiz=${treeRoot.id}&foco=${entity.id}`}>
                  Ver en el árbol
                </Link>
              ) : null}
            </div>
          </header>

          <aside className="dossier__meta">
            <div className="meta-row">
              <span>Tipo</span>
              <strong>{typeLabel[entity.type]}</strong>
            </div>
            {entity.rank ? (
              <div className="meta-row">
                <span>Posición</span>
                <strong>
                  N.º {entity.rank} · {entity.tier}
                </strong>
              </div>
            ) : null}
            {entity.mediaKind ? (
              <div className="meta-row">
                <span>Categoría</span>
                <strong>{mediaKindLabel[entity.mediaKind]}</strong>
              </div>
            ) : null}
            {entity.sector ? (
              <div className="meta-row">
                <span>Sector</span>
                <strong>{entity.sector}</strong>
              </div>
            ) : null}
            {entity.founded ? (
              <div className="meta-row">
                <span>Fundación</span>
                <strong>{entity.founded}</strong>
              </div>
            ) : null}
            {entity.headquarters ? (
              <div className="meta-row">
                <span>Sede</span>
                <strong>{entity.headquarters}</strong>
              </div>
            ) : null}
            <div className="meta-row">
              <span>Dueño directo</span>
              {directOwner ? (
                <Link to={`/expediente/${directOwner.id}`}>{directOwner.name}</Link>
              ) : (
                <strong>Sin dueño registrado</strong>
              )}
            </div>
            <div className="meta-row">
              <span>Grupo último</span>
              {ultimateGroup ? (
                <Link to={`/expediente/${ultimateGroup.id}`}>{ultimateGroup.name}</Link>
              ) : (
                <strong>—</strong>
              )}
            </div>
            <div className="meta-row">
              <span>Vínculo</span>
              <strong>
                {ownerRelation ? relationLabel[ownerRelation.kind] : '—'}
                {ownerRelation?.stake ? ` · ${ownerRelation.stake}` : ''}
              </strong>
            </div>
          </aside>
        </div>

        <section className="dossier__section">
          <div className="dossier__section-head">
            <p className="eyebrow">TRAZABILIDAD</p>
            <h2>Cadena de propiedad</h2>
            <p>Se sigue la relación principal de cada entidad hasta llegar al control último.</p>
          </div>
          <Chain id={entity.id} />
          {ownerRelation?.note ? <p className="fine-print">{ownerRelation.note}</p> : null}
        </section>

        {tree ? (
          <section className="dossier__section">
            <div className="dossier__section-head">
              <p className="eyebrow">NAVEGACIÓN</p>
              <h2>Árbol de propiedad</h2>
              <p>
                Abra las ramas para bajar hacia medios y marcas; haga clic en un nombre para abrir
                su ficha. La ruta hasta esta entidad queda abierta.
              </p>
            </div>
            <OwnershipTree tree={tree} focusId={entity.id} />
            <div className="tree-jump">
              <Link to={`/arbol?raiz=${treeRoot?.id ?? entity.id}&foco=${entity.id}`}>
                Abrir en el árbol completo →
              </Link>
            </div>
          </section>
        ) : null}

        {entity.type === 'medio' ? (
          <section className="owner-callout">
            <div>
              <p className="eyebrow">RESPUESTA CORTA</p>
              <h2>
                {directOwner ? (
                  <>
                    Este medio pertenece a <Link to={`/expediente/${directOwner.id}`}>{directOwner.name}</Link>.
                  </>
                ) : (
                  'No hay un propietario privado identificado.'
                )}
              </h2>
              {ultimateGroup && ultimateGroup.id !== directOwner?.id ? (
                <p>
                  El control último registrado es <Link to={`/expediente/${ultimateGroup.id}`}>{ultimateGroup.name}</Link>.
                </p>
              ) : null}
            </div>
            <Stamp tone="red">Consultado</Stamp>
          </section>
        ) : null}

        {properties.length ? (
          <section className="dossier__section">
            <div className="dossier__section-head">
              <p className="eyebrow">PROPIEDADES</p>
              <h2>Lo que controla {entity.name}</h2>
              <p>Vínculos directos registrados. Abra cada ficha para ver su propia cadena.</p>
            </div>
            <div className="property-grid">
              {properties.map((relation) => {
                const property = relation.owned ? getEntity(relation.owned) : undefined
                if (!property) return null
                return <EntityCard key={relation.id} entity={property} relation={relation} />
              })}
            </div>
          </section>
        ) : null}

        {siblings.length ? (
          <section className="dossier__section">
            <div className="dossier__section-head">
              <p className="eyebrow">EN EL MISMO GRUPO</p>
              <h2>Vecinos de expediente</h2>
            </div>
            <div className="property-grid">
              {siblings.map((sibling) => (
                <EntityCard key={sibling.id} entity={sibling} />
              ))}
            </div>
          </section>
        ) : null}

        {history.length ? (
          <section className="dossier__section">
            <div className="dossier__section-head">
              <p className="eyebrow">HISTORIAL</p>
              <h2>Vínculos cerrados</h2>
            </div>
            <ul className="history">
              {history.map((relation) => {
                const owner = getEntity(relation.owner)
                const owned = getEntity(relation.owned)
                if (!owner || !owned) return null
                return (
                  <li key={relation.id} className="history__item">
                    <span className="history__date">{formatSpan(relation)}</span>
                    <span>
                      <Link to={`/expediente/${owner.id}`}>{owner.name}</Link>
                      {' → '}
                      <Link to={`/expediente/${owned.id}`}>{owned.name}</Link>
                    </span>
                    <span className="tag tag--ghost">{relationLabel[relation.kind]}</span>
                    {relation.note ? <p>{relation.note}</p> : null}
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        <section className="dossier__section">
          <div className="dossier__section-head">
            <p className="eyebrow">PAPEL DE ORIGEN</p>
            <h2>Fuentes de este expediente</h2>
            <p>Cada vínculo de la cadena y de las propiedades directas está respaldado por un documento.</p>
          </div>
          <SourceList sourceIds={sourceIds} />
        </section>

        <div className="dossier__foot">
          <span>WHOM · {entitySerial(entity.id)}</span>
          <span>Última verificación: {formatDate(DATA_CUTOFF)}</span>
          <Link to="/metodo">Cómo leer este documento →</Link>
        </div>
      </article>
    </div>
  )
}
