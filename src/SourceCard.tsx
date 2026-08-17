import { PencilSimple, Trash } from '@phosphor-icons/react'
import { getSourceImageAlt, type ArchiveSource } from './archive-data'

type SourceCardProps = {
  readonly cardRef: (element: HTMLButtonElement | null) => void
  readonly index: number
  readonly source: ArchiveSource
  readonly selected: boolean
  readonly confirmDelete: boolean
  readonly onDelete: (source: ArchiveSource) => void
  readonly onEdit: (source: ArchiveSource) => void
  readonly onSelect: (source: ArchiveSource) => void
}

export function SourceCard({ cardRef, index, source, selected, confirmDelete, onDelete, onEdit, onSelect }: SourceCardProps) {
  const titleId = `source-title-${source.id}`
  const detailsId = `source-details-${source.id}`
  return <article className="source-shell" data-owned={source.owner === 'user'}>
    <button ref={cardRef} className="source-card" type="button" aria-labelledby={titleId} aria-describedby={detailsId} aria-pressed={selected} onClick={() => onSelect(source)}>
      <span className="source-index">{String(index + 1).padStart(2, '0')}</span>
      <img src={source.asset} alt={getSourceImageAlt(source)} width="800" height="600" />
      <span className="source-copy"><strong id={titleId}>{source.title}</strong><span className="source-details" id={detailsId}><small>{source.note}</small><span className="tag-row">{source.tags.map((tag) => <span key={tag}>{tag}</span>)}</span><span className="source-origin">{source.link ? source.link.replace(/^https?:\/\//u, '') : source.owner === 'user' ? 'Uploaded from this browser' : 'Original SVG study'}</span><em>{source.license}</em></span></span>
    </button>
    {source.owner === 'user' && <div className="source-actions"><button type="button" onClick={() => onEdit(source)} aria-label={`Edit ${source.title}`}><PencilSimple size={16} /> Edit</button><button className={confirmDelete ? 'confirm-delete' : ''} type="button" onClick={() => onDelete(source)} aria-label={confirmDelete ? `Confirm delete ${source.title}` : `Delete ${source.title}`}><Trash size={16} /> {confirmDelete ? 'Confirm delete' : 'Delete'}</button></div>}
  </article>
}
