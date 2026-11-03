import { Link, useSearchParams } from 'react-router-dom'
import { EntityCard } from '../components/EntityCard'
import { SearchBox } from '../components/SearchBox'
import { Stamp } from '../components/Stamp'
import { usePageTitle } from '../usePageTitle'
import { getChain, getDirectOwner, search } from '../data/queries'

const popular = ['El Corral', 'Semana', 'Caracol', 'RCN', 'El Tiempo', 'El Espectador', 'Nutresa', 'Valórem', 'Prisa']

export function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  usePageTitle(query ? `Buscar: ${query}` : 'Buscar')
  const results = search(query, 30)
  const groups = results.filter((entity) => entity.type === 'grupo').length
  const media = results.filter((entity) => entity.type === 'medio').length

  return (
    <div className="page">
      <section className="page-head shell">
        <p className="eyebrow">CONSULTA / RESULTADOS</p>
        <h1 className="page-title">Buscar en el registro</h1>
        <p className="page-lede">
          Escriba el nombre de un medio, una marca, un grupo o una familia. También puede buscar
          por alias, como «canal RCN» o «gaseosas Postobón».
        </p>
        <SearchBox initial={query} />
      </section>

      <section className="shell section section--tight">
        {query ? (
          <>
            <div className="results-head">
              <p className="eyebrow">
                {results.length} {results.length === 1 ? 'expediente' : 'expedientes'} para «{query}»
              </p>
              <div className="results-tags">
                <span className="tag">{groups} grupos</span>
                <span className="tag">{media} medios</span>
                <Link className="text-link" to="/registro">
                  Ver registro completo →
                </Link>
              </div>
            </div>

            {results.length ? (
              <div className="results-grid">
                {results.map((entity) => {
                  const owner = getDirectOwner(entity.id)
                  const chain = getChain(entity.id)
                  const tail = chain.slice(1, 3).map((step) => step.entity.name).join(' → ')
                  return (
                    <EntityCard
                      key={entity.id}
                      entity={entity}
                      note={owner ? `Cadena: ${tail}` : 'Sin dueño registrado'}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="empty paper">
                <Stamp>SIN COINCIDENCIAS</Stamp>
                <h2>El archivo no tiene ese nombre</h2>
                <p>
                  Pruebe con una marca, un medio o un apellido. Si el dato debería estar y no está,
                  puede reportarlo en el repositorio.
                </p>
                <div className="quick-links">
                  {popular.slice(0, 5).map((term) => (
                    <Link key={term} className="chip" to={`/buscar?q=${encodeURIComponent(term)}`}>
                      {term}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty paper">
            <Stamp tone="olive">ARCHIVO ABIERTO</Stamp>
            <h2>¿Qué quiere consultar?</h2>
            <p>
              El registro cruza medios, empresas, grupos y familias. Empiece por una marca conocida
              o por el nombre de un grupo.
            </p>
            <div className="quick-links">
              {popular.map((term) => (
                <Link key={term} className="chip" to={`/buscar?q=${encodeURIComponent(term)}`}>
                  {term}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
