import { Link } from 'react-router-dom'
import { entities, relations, sources } from '../data'
import {
  getGroupBusinesses,
  getGroups,
  getMediaOfGroupByChain,
} from '../data/queries'
import { timeline } from '../data/timeline'
import { DATA_CUTOFF } from '../data/types'
import { entitySerial, formatDate } from '../format'
import { Chain } from '../components/Chain'
import { SearchBox } from '../components/SearchBox'
import { Stamp } from '../components/Stamp'
import { TimelineList } from '../components/TimelineList'
import { usePageTitle } from '../usePageTitle'

const featured = [
  {
    id: 'el-corral',
    code: 'CASO 01 / LA MARCA',
    title: 'La hamburguesa y la revista',
    text: 'El Corral pertenece a Nutresa. Nutresa está controlada por el consorcio Gilinski/IHC. La misma familia es dueña de Semana.',
    linkLabel: 'Abrir El Corral',
  },
  {
    id: 'caracol-tv',
    code: 'CASO 02 / EL NOMBRE',
    title: 'Dos Caracoles, dos dueños',
    text: 'Caracol Televisión es de Valórem. Caracol Radio es de PRISA. Comparten marca, no propietario.',
    linkLabel: 'Abrir Caracol TV',
    extra: { to: '/expediente/caracol-radio', label: 'Ver Caracol Radio' },
  },
  {
    id: 'el-espectador',
    code: 'CASO 03 / EL PAPEL',
    title: 'El periódico que se volvió fundación',
    text: 'Valórem compró El Espectador en 1997. Desde 2025 opera como entidad sin ánimo de lucro, dentro del grupo Santo Domingo.',
    linkLabel: 'Abrir El Espectador',
  },
]

export function Home() {
  usePageTitle('¿De quién es lo que lee?')
  const groups = getGroups()
  const recent = [...timeline].reverse()

  return (
    <div className="home">
      <section className="hero">
        <div className="shell hero__grid">
          <div className="hero__copy">
            <p className="eyebrow">EXPEDIENTE 001 · PROPIEDAD DE MEDIOS</p>
            <h1 className="hero__title">
              ¿De quién
              <span>es lo que lee?</span>
            </h1>
            <p className="hero__lede">
              Un registro abierto de los grupos, familias y empresas que están detrás de los
              medios y las marcas de Colombia. Busque un nombre y siga la cadena hasta el final.
            </p>
            <SearchBox size="hero" />
            <div className="quick-links" aria-label="Consultas rápidas">
              <span className="quick-links__label">Pruebe con</span>
              {['El Corral', 'Semana', 'Caracol', 'RCN', 'El Tiempo'].map((term) => (
                <Link key={term} className="chip" to={`/buscar?q=${encodeURIComponent(term)}`}>
                  {term}
                </Link>
              ))}
            </div>
            <dl className="stats">
              <div>
                <dt>Entidades</dt>
                <dd>{entities.length}</dd>
              </div>
              <div>
                <dt>Vínculos</dt>
                <dd>{relations.length}</dd>
              </div>
              <div>
                <dt>Fuentes</dt>
                <dd>{sources.length}</dd>
              </div>
              <div>
                <dt>Corte</dt>
                <dd>{formatDate(DATA_CUTOFF)}</dd>
              </div>
            </dl>
          </div>

          <Link className="dossier-card paper" to="/expediente/el-corral" aria-label="Abrir el expediente de El Corral">
            <div className="dossier-card__head">
              <span>FORMULARIO 04-B</span>
              <span className="serial">WH-0001</span>
            </div>
            <div className="dossier-card__title">Solicitud de consulta</div>
            <div className="dossier-card__field">
              <span>Nombre consultado</span>
              <strong>El Corral</strong>
            </div>
            <div className="dossier-card__field">
              <span>Propietario directo</span>
              <strong>Grupo Nutresa</strong>
            </div>
            <div className="dossier-card__field">
              <span>Control último</span>
              <strong>Familia Gilinski</strong>
            </div>
            <div className="dossier-card__field">
              <span>Vínculo con medios</span>
              <strong>Semana · Dinero · SoHo</strong>
            </div>
            <div className="dossier-card__stamp">
              <Stamp>Consulta aprobada</Stamp>
            </div>
            <div className="barcode" aria-hidden="true" />
            <p className="dossier-card__foot">
              Toda relación tiene fuente. Toda cadena se puede recorrer.
            </p>
          </Link>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...groups, ...groups].map((group, index) => (
            <span key={`${group.id}-${index}`}>
              {group.name} <b>◆</b>
            </span>
          ))}
        </div>
      </div>

      <section className="section shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">SALA DE LECTURA</p>
            <h2>Expedientes destacados</h2>
          </div>
          <p className="section__note">Tres formas de leer la misma pregunta: ¿quién está detrás?</p>
        </div>

        <div className="cases">
          {featured.map((item) => (
            <article className="case paper" key={item.id}>
              <div className="case__head">
                <span className="case__code">{item.code}</span>
                <Stamp tone={item.id === 'el-corral' ? 'red' : 'olive'}>Verificado</Stamp>
              </div>
              <h3 className="case__title">{item.title}</h3>
              <p className="case__text">{item.text}</p>
              <div className="case__chain">
                <Chain id={item.id} compact />
              </div>
              <div className="case__actions">
                <Link className="btn btn--ghost" to={`/expediente/${item.id}`}>
                  {item.linkLabel}
                </Link>
                {item.extra ? (
                  <Link className="text-link" to={item.extra.to}>
                    {item.extra.label} →
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--groups shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">REGISTRO DE GRUPOS</p>
            <h2>Los dueños, en una pared</h2>
          </div>
          <Link className="text-link" to="/mapa">
            Ver el mapa completo →
          </Link>
        </div>
        <p className="fine-print section__ranking">
          Ordenados de mayor a menor alcance nacional, número de medios y tamaño del grupo. Es un
          criterio editorial, no una medición de riqueza.
        </p>

        <div className="groups-grid">
          {groups.map((group) => {
            const mediaCount = getMediaOfGroupByChain(group.id).length
            const businessCount = getGroupBusinesses(group.id).length
            return (
              <Link className="group-card paper" key={group.id} to={`/expediente/${group.id}`}>
                <div className="group-card__head">
                  <span className="serial">
                    N.º {group.rank} · {entitySerial(group.id)}
                  </span>
                  <Stamp tone="olive">Registrado</Stamp>
                </div>
                <h3>{group.name}</h3>
                <p>
                  {group.tier} · {group.sector}
                </p>
                <div className="group-card__counts">
                  <span>
                    <strong>{mediaCount}</strong> medios
                  </span>
                  <span>
                    <strong>{businessCount}</strong> empresas
                  </span>
                </div>
                <span className="group-card__open">Abrir grupo →</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="section shell">
        <div className="section__head">
          <div>
            <p className="eyebrow">MOVIMIENTOS RECIENTES</p>
            <h2>Lo que cambió de manos</h2>
          </div>
          <Link className="text-link" to="/metodo#movimientos">
            Ver línea de tiempo →
          </Link>
        </div>
        <div className="timeline-wrap paper">
          <TimelineList events={recent} limit={5} />
        </div>
      </section>

      <section className="method-band">
        <div className="shell method-band__inner">
          <div>
            <p className="eyebrow">NOTA AL MARGEN</p>
            <h2>No es una acusación. Es un registro.</h2>
          </div>
          <p>
            WHOM no dice qué pensar de un medio. Dice quién lo posee, qué otras empresas tiene
            ese dueño y de dónde sale el dato. La propiedad no es lo mismo que el control
            editorial; cada ficha muestra el tipo de vínculo.
          </p>
          <Link className="btn btn--ghost" to="/metodo">
            Cómo se construye
          </Link>
        </div>
      </section>
    </div>
  )
}
