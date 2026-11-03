import { Link } from 'react-router-dom'
import { getEntity, getGroups, getMediaOfGroupByChain, getProperties } from '../data/queries'
import type { Entity } from '../data/types'
import { entitySerial, mediaKindLabel, typeLabel } from '../format'
import { Stamp } from '../components/Stamp'
import { usePageTitle } from '../usePageTitle'

function MapGroup({ group }: { group: Entity }) {
  const media = getMediaOfGroupByChain(group.id)
  const businesses = getProperties(group.id)
    .map((relation) => getEntity(relation.owned))
    .filter((entity): entity is Entity => Boolean(entity) && entity?.type === 'empresa')

  return (
    <article className="map-group paper">
      <header className="map-group__head">
        <div>
          <span className="serial">{entitySerial(group.id)}</span>
          <h2>
            <Link to={`/expediente/${group.id}`}>{group.name}</Link>
          </h2>
          <p>
            {group.tier} · {group.sector}
          </p>
        </div>
        <Stamp tone="olive">Grupo</Stamp>
      </header>

      <div className="map-group__cols">
        <div>
          <h3>Medios bajo el grupo <span>{media.length}</span></h3>
          <ul className="map-list">
            {media.map((entity) => (
              <li key={entity.id}>
                <Link className="map-item" to={`/expediente/${entity.id}`}>
                  <span className="tag">{mediaKindLabel[entity.mediaKind ?? 'digital']}</span>
                  <strong>{entity.name}</strong>
                  <span className="map-item__owner">dueño directo: {getEntityDirectName(entity.id)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Empresas y marcas <span>{businesses.length}</span></h3>
          {businesses.length ? (
            <ul className="map-list">
              {businesses.map((entity) => (
                <li key={entity.id}>
                  <Link className="map-item" to={`/expediente/${entity.id}`}>
                    <span className="tag tag--ghost">Empresa</span>
                    <strong>{entity.name}</strong>
                    <span className="map-item__owner">{entity.sector ?? typeLabel[entity.type]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Sin empresas registradas fuera de medios.</p>
          )}
        </div>
      </div>
    </article>
  )
}

function getEntityDirectName(id: string): string {
  const entity = getEntity(id)
  if (!entity) return '—'
  return entity.name
}

export function MapPage() {
  usePageTitle('Mapa de propiedad')
  const groups = getGroups()
  const rtvc = getEntity('rtvc')
  const publicMedia = rtvc
    ? getProperties(rtvc.id)
        .map((relation) => getEntity(relation.owned))
        .filter((entity): entity is Entity => Boolean(entity) && entity?.type === 'medio')
    : []

  return (
    <div className="page">
      <section className="page-head shell">
        <p className="eyebrow">CARTOGRAFÍA / PROPIEDAD</p>
        <h1 className="page-title">El mapa de los dueños</h1>
        <p className="page-lede">
          Los grupos y los medios que controlan. Es un mapa de primer nivel: cada ficha abre la
          cadena completa, las participaciones y las fuentes.
        </p>
      </section>

      <section className="shell section section--tight">
        <div className="map-note paper">
          <Stamp tone="ink">Cómo leer</Stamp>
          <p>
            Un medio puede estar dentro de una empresa que, a su vez, pertenece a un grupo. Aquí se
            muestra el conjunto consolidado por cadena de propiedad; el detalle está en cada
            expediente.
          </p>
        </div>

        <div className="map-stack">
          {groups.map((group) => (
            <MapGroup key={group.id} group={group} />
          ))}

          {rtvc ? (
            <article className="map-group paper">
              <header className="map-group__head">
                <div>
                  <span className="serial">{entitySerial(rtvc.id)}</span>
                  <h2>
                    <Link to={`/expediente/${rtvc.id}`}>{rtvc.name}</Link>
                  </h2>
                  <p>
                    {rtvc.tier} · {rtvc.sector}
                  </p>
                </div>
                <Stamp tone="ink">Público</Stamp>
              </header>
              <div className="map-group__cols">
                <div>
                  <h3>Medios públicos <span>{publicMedia.length}</span></h3>
                  <ul className="map-list">
                    {publicMedia.map((entity) => (
                      <li key={entity.id}>
                        <Link className="map-item" to={`/expediente/${entity.id}`}>
                          <span className="tag">{mediaKindLabel[entity.mediaKind ?? 'digital']}</span>
                          <strong>{entity.name}</strong>
                          <span className="map-item__owner">operado por RTVC</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>Naturaleza</h3>
                  <p className="muted">
                    RTVC es el sistema de medios públicos. No es un grupo privado: su propiedad es
                    estatal.
                  </p>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}
