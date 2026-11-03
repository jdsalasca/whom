import { Link } from 'react-router-dom'
import type { TimelineEvent } from '../data/types'
import { getEntity } from '../data/queries'
import { formatDate } from '../format'

export function TimelineList({ events, limit }: { events: TimelineEvent[]; limit?: number }) {
  const items = limit ? events.slice(0, limit) : events

  return (
    <ol className="timeline">
      {items.map((event) => (
        <li className="timeline__item" key={`${event.date}-${event.title}`}>
          <time className="timeline__date" dateTime={event.date}>
            {formatDate(event.date)}
          </time>
          <div className="timeline__body">
            <h3 className="timeline__title">{event.title}</h3>
            <p className="timeline__detail">{event.detail}</p>
            <div className="timeline__links">
              {event.entityIds.map((id) => {
                const entity = getEntity(id)
                if (!entity) return null
                return (
                  <Link key={id} className="chip" to={`/expediente/${id}`}>
                    {entity.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
