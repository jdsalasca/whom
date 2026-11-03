import { Link, NavLink, Outlet } from 'react-router-dom'
import { entities, relations, sources } from '../data'
import { DATA_CUTOFF } from '../data/types'
import { formatDate } from '../format'

const nav = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/buscar', label: 'Buscar' },
  { to: '/registro', label: 'Registro' },
  { to: '/arbol', label: 'Árbol' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/metodo', label: 'Método' },
]

export function Layout() {
  return (
    <div className="site">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>

      <header className="site-header">
        <div className="topbar">
          <div className="shell topbar__inner">
            <span>ARCHIVO ABIERTO · COLOMBIA</span>
            <span className="topbar__desktop">CORTE {formatDate(DATA_CUTOFF)}</span>
            <span className="topbar__warning">PROYECTO INDEPENDIENTE · NO ESTATAL</span>
          </div>
        </div>

        <div className="masthead shell">
          <Link className="brand" to="/" aria-label="WHOM, inicio">
            <span className="brand__mark" aria-hidden="true">
              W
            </span>
            <span className="brand__text">
              <strong>WHOM</strong>
              <small>Registro de propiedad de medios</small>
            </span>
          </Link>

          <nav className="nav" aria-label="Navegación principal">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header-strip" aria-hidden="true">
          <span>FORMULARIO 04-B</span>
          <span>PROPIEDAD · CONTROL · AFILIACIÓN</span>
          <span>CONSULTA PÚBLICA</span>
          <span>{entities.length} ENTIDADES / {relations.length} VÍNCULOS / {sources.length} FUENTES</span>
        </div>
      </header>

      <main id="contenido" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div>
            <div className="brand brand--footer">
              <span className="brand__mark" aria-hidden="true">
                W
              </span>
              <span className="brand__text">
                <strong>WHOM</strong>
                <small>Registro abierto de propiedad de medios</small>
              </span>
            </div>
            <p className="site-footer__note">
              Un expediente ciudadano sobre quién es dueño de qué en los medios y las marcas de
              Colombia. No es una entidad del Estado ni representa a los medios citados.
            </p>
          </div>
          <div className="site-footer__links">
            <Link to="/metodo">Método y fuentes</Link>
            <Link to="/registro">Registro completo</Link>
            <Link to="/arbol">Árbol de propiedad</Link>
            <a href="https://github.com/jdsalasca/whom" target="_blank" rel="noreferrer">
              Código abierto ↗
            </a>
            <a href="https://github.com/jdsalasca/whom/issues" target="_blank" rel="noreferrer">
              Reportar un error ↗
            </a>
          </div>
          <div className="site-footer__stamp">
            <span className="stamp stamp--olive">Corte {formatDate(DATA_CUTOFF)}</span>
            <span className="serial">WHOM / CO / 2026</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
