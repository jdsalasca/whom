import { Link, useSearchParams } from 'react-router-dom'
import { OwnershipTree } from '../components/OwnershipTree'
import { Stamp } from '../components/Stamp'
import { getDirectOwner, getEntity, getGroups, getTree } from '../data/queries'
import { downloadEntityPdf } from '../pdf'
import { entitySerial, typeLabel } from '../format'
import { usePageTitle } from '../usePageTitle'

export function TreePage() {
  const [params] = useSearchParams()
  const groups = getGroups()
  const rtvc = getEntity('rtvc')
  const roots = [...groups, ...(rtvc ? [rtvc] : [])]
  const requested = params.get('raiz')
  const requestedEntity = requested ? getEntity(requested) : undefined
  const extraRoot = requestedEntity && !roots.some((entity) => entity.id === requestedEntity.id) ? requestedEntity : null
  const pickerRoots = extraRoot ? [extraRoot, ...roots] : roots
  const selected = pickerRoots.find((entity) => entity.id === requested) ?? requestedEntity ?? roots[0]
  const focus = params.get('foco') ?? selected.id
  const tree = getTree(selected.id)
  const focusEntity = getEntity(focus)
  const parent = getDirectOwner(focus)
  usePageTitle(`Árbol: ${selected.name}`)

  return (
    <div className="page">
      <section className="page-head shell">
        <p className="eyebrow">EXPLORADOR / ÁRBOL DE PROPIEDAD</p>
        <h1 className="page-title">El árbol de los dueños</h1>
        <p className="page-lede">
          Abra y cierre ramas para bajar por el grupo, la empresa y la marca. El nombre abre la
          ficha; el botón +/− expande la rama. Las raíces están ordenadas por alcance y tamaño.
        </p>
      </section>

      <section className="shell section section--tight">
        <nav className="root-picker" aria-label="Elegir raíz del árbol">
          {pickerRoots.map((root) => (
            <Link
              key={root.id}
              className={`root-chip ${root.id === selected.id ? 'is-active' : ''}`}
              to={`/arbol?raiz=${root.id}`}
            >
              <span className="root-chip__rank">
                {root.rank ? String(root.rank).padStart(2, '0') : '—'}
              </span>
              <span>
                <strong>{root.name}</strong>
                <small>
                  {root.tier ?? typeLabel[root.type]}
                  {root.tier === 'regional' ? ' · regional' : ''}
                </small>
              </span>
            </Link>
          ))}
        </nav>

        <div className="tree-panel paper">
          <header className="tree-panel__head">
            <div>
              <span className="serial">{entitySerial(selected.id)}</span>
              <h2>{selected.name}</h2>
              <p>{selected.sector}</p>
            </div>
            <div className="tree-panel__actions">
              <Stamp tone="olive">Árbol abierto</Stamp>
              <button className="btn btn--ghost" type="button" onClick={() => downloadEntityPdf(selected.id)}>
                Descargar PDF
              </button>
            </div>
          </header>

          <div className="tree-panel__path">
            <span>Ruta actual:</span>
            {focusEntity ? (
              <Link to={`/expediente/${focusEntity.id}`}>{focusEntity.name}</Link>
            ) : (
              <span>—</span>
            )}
            {parent ? (
              <Link className="tree-panel__up" to={`/arbol?raiz=${selected.id}&foco=${parent.id}`}>
                Subir a {parent.name} ↑
              </Link>
            ) : null}
          </div>

          {tree ? (
            <OwnershipTree tree={tree} focusId={focus} />
          ) : (
            <p className="muted">Sin ramas registradas para esta raíz.</p>
          )}

          <footer className="tree-panel__foot">
            <Link to={`/expediente/${selected.id}`}>Abrir ficha de {selected.name} →</Link>
            <Link to="/metodo">Cómo se lee el árbol →</Link>
          </footer>
        </div>
      </section>
    </div>
  )
}
