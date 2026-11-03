import { getSource } from '../data/queries'
import { formatDate } from '../format'

const kindLabel = {
  oficial: 'Fuente oficial',
  prensa: 'Prensa',
  investigación: 'Investigación',
} as const

export function SourceList({ sourceIds }: { sourceIds: string[] }) {
  const unique = [...new Set(sourceIds)]
  const items = unique
    .map((id) => getSource(id))
    .filter((source): source is NonNullable<typeof source> => Boolean(source))

  if (!items.length) {
    return <p className="muted">Sin fuentes registradas.</p>
  }

  return (
    <ol className="sources">
      {items.map((source, index) => (
        <li className="source" key={source.id}>
          <span className="source__index">{String(index + 1).padStart(2, '0')}</span>
          <div className="source__body">
            <a className="source__title" href={source.url} target="_blank" rel="noreferrer">
              {source.title}
            </a>
            <div className="source__meta">
              <span>{source.publisher}</span>
              <span>{formatDate(source.date)}</span>
              <span className="tag tag--ghost">{kindLabel[source.kind]}</span>
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
