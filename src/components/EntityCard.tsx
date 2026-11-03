import { Link } from 'react-router-dom'
import type { Entity, Relation } from '../data/types'
import { getDirectOwner } from '../data/queries'
import { entitySerial, mediaKindLabel, relationLabel, typeLabel } from '../format'

export function EntityCard({
  entity,
  relation,
  note,
}: {
  entity: Entity
  relation?: Relation
  note?: string
}) {
  const owner = getDirectOwner(entity.id)

  return (
    <Link className={`entity-card entity-card--${entity.type}`} to={`/expediente/${entity.id}`}>
      <div className="entity-card__top">
        <span className="tag">{typeLabel[entity.type]}</span>
        {entity.mediaKind ? <span className="tag tag--ghost">{mediaKindLabel[entity.mediaKind]}</span> : null}
        <span className="serial">{entitySerial(entity.id)}</span>
      </div>
      <h3 className="entity-card__name">{entity.name}</h3>
      <p className="entity-card__summary">{entity.summary}</p>
      <div className="entity-card__foot">
        {relation ? (
          <span>
            {relationLabel[relation.kind]}
            {relation.stake ? ` · ${relation.stake}` : ''}
          </span>
        ) : null}
        {note ? <span>{note}</span> : null}
        {!relation && owner && !note ? <span>Dueño: {owner.name}</span> : null}
        <span className="entity-card__open">Abrir expediente →</span>
      </div>
    </Link>
  )
}
