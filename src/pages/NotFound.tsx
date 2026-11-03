import { Link } from 'react-router-dom'
import { Stamp } from '../components/Stamp'
import { usePageTitle } from '../usePageTitle'

export function NotFound() {
  usePageTitle('Expediente no encontrado')
  return (
    <div className="page">
      <section className="shell section">
        <div className="empty paper">
          <Stamp>EXPEDIENTE NO ENCONTRADO</Stamp>
          <h1>Este papel no está en el archivo</h1>
          <p>
            La dirección no corresponde a ninguna entidad registrada. Puede volver al inicio o
            consultar el registro completo.
          </p>
          <div className="quick-links">
            <Link className="btn btn--ghost" to="/">
              Volver al inicio
            </Link>
            <Link className="text-link" to="/registro">
              Ver registro →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
