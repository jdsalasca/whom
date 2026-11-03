import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { getChain } from '../data/queries'
import { relationLabel, typeLabel } from '../format'
import { Stamp } from './Stamp'

export function Chain({ id, compact = false }: { id: string; compact?: boolean }) {
  const chain = getChain(id)

  if (chain.length <= 1) {
    return (
      <div className="chain-empty">
        <Stamp tone="ink">Sin dueño registrado</Stamp>
        <p>No hay una relación de propiedad documentada para esta entidad.</p>
      </div>
    )
  }

  return (
    <ol className={`chain ${compact ? 'chain--compact' : ''}`} aria-label="Cadena de propiedad">
      {chain.map((step, index) => (
        <Fragment key={step.entity.id}>
          <li className="chain__item">
            <Link className={`chain__node chain__node--${step.entity.type}`} to={`/expediente/${step.entity.id}`}>
              <span className="chain__index">{String(index + 1).padStart(2, '0')}</span>
              <span className="chain__type">{typeLabel[step.entity.type]}</span>
              <strong className="chain__name">{step.entity.name}</strong>
            </Link>
          </li>
          {step.relation && step.owner ? (
            <li className="chain__edge" aria-label={`${relationLabel[step.relation.kind]} de ${step.owner.name}`}>
              <span className="chain__edge-label">{relationLabel[step.relation.kind]}</span>
              <span className="chain__arrow" aria-hidden="true">
                →
              </span>
              {step.relation.stake ? <span className="chain__stake">{step.relation.stake}</span> : null}
            </li>
          ) : null}
        </Fragment>
      ))}
    </ol>
  )
}
