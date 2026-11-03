import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { TreeBranch } from '../data/queries'
import { relationLabel, typeLabel } from '../format'

function findPath(branch: TreeBranch, id: string, path: string[] = []): string[] | null {
  const next = [...path, branch.entity.id]
  if (branch.entity.id === id) return next
  for (const child of branch.children) {
    const found = findPath(child, id, next)
    if (found) return found
  }
  return null
}

function collectExpandable(branch: TreeBranch): string[] {
  return [
    ...(branch.children.length ? [branch.entity.id] : []),
    ...branch.children.flatMap(collectExpandable),
  ]
}

function countNodes(branch: TreeBranch): number {
  return 1 + branch.children.reduce((total, child) => total + countNodes(child), 0)
}

function TreeNodes({
  branch,
  expanded,
  toggle,
  focusId,
}: {
  branch: TreeBranch
  expanded: Set<string>
  toggle: (id: string) => void
  focusId?: string
}) {
  const isRoot = !branch.relation
  const isFocus = branch.entity.id === focusId
  const isOpen = expanded.has(branch.entity.id)
  const hasChildren = branch.children.length > 0

  return (
    <li className={`tree-node ${isRoot ? 'tree-node--root' : ''}`}>
      <div className={`tree-row ${isFocus ? 'is-focus' : ''}`}>
        {hasChildren ? (
          <button
            className="tree-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-label={`${isOpen ? 'Contraer' : 'Expandir'} ${branch.entity.name}`}
            onClick={() => toggle(branch.entity.id)}
          >
            {isOpen ? '−' : '+'}
          </button>
        ) : (
          <span className="tree-bullet" aria-hidden="true">
            ·
          </span>
        )}

        <Link className="tree-link" to={`/expediente/${branch.entity.id}`}>
          <span className="tag">{typeLabel[branch.entity.type]}</span>
          <strong className="tree-name">{branch.entity.name}</strong>
          {branch.relation ? (
            <span className="tree-rel">
              {relationLabel[branch.relation.kind]}
              {branch.relation.stake ? ` · ${branch.relation.stake}` : ''}
            </span>
          ) : null}
        </Link>

        {hasChildren ? <span className="tree-count">{branch.children.length}</span> : null}
      </div>

      {hasChildren && isOpen ? (
        <ul className="tree-children">
          {branch.children.map((child) => (
            <TreeNodes
              key={child.entity.id}
              branch={child}
              expanded={expanded}
              toggle={toggle}
              focusId={focusId}
            />
          ))}
        </ul>
      ) : null}
    </li>
  )
}

export function OwnershipTree({ tree, focusId }: { tree: TreeBranch; focusId?: string }) {
  const path = findPath(tree, focusId ?? tree.entity.id) ?? [tree.entity.id]
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(path))

  useEffect(() => {
    setExpanded(new Set(findPath(tree, focusId ?? tree.entity.id) ?? [tree.entity.id]))
  }, [tree.entity.id, focusId])

  const total = countNodes(tree)
  const expandable = collectExpandable(tree)

  function toggle(id: string) {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="tree">
      <div className="tree__toolbar">
        <span className="tree__hint">
          {total} nodos · haga clic en + para bajar, en el nombre para abrir la ficha
        </span>
        <div className="tree__actions">
          <button className="btn btn--ghost" type="button" onClick={() => setExpanded(new Set(expandable))}>
            Expandir todo
          </button>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => setExpanded(new Set([tree.entity.id]))}
          >
            Contraer
          </button>
        </div>
      </div>

      <ul className="tree__roots">
        <TreeNodes branch={tree} expanded={expanded} toggle={toggle} focusId={focusId} />
      </ul>
    </div>
  )
}
