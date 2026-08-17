import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Check, Image, X } from '@phosphor-icons/react'
import { linkPlaceholderAsset } from './archive-data'
import { parseTags, readImageFile, userSourceSchema, type UserSource } from './user-sources'
import './SourceManager.css'

type SourceComposerProps = {
  readonly source?: UserSource | undefined
  readonly onCancel: () => void
  readonly onSave: (source: UserSource) => boolean
}

type ErrorField = 'form' | 'image' | 'link' | 'note' | 'rules' | 'tags' | 'title'
type ComposerError = { readonly field: ErrorField; readonly message: string }

const defaultAsset = linkPlaceholderAsset

export function SourceComposer({ source, onCancel, onSave }: SourceComposerProps) {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [asset, setAsset] = useState(source?.asset ?? defaultAsset)
  const [fileFeedback, setFileFeedback] = useState('')
  const [error, setError] = useState<ComposerError | null>(null)
  const [readingImage, setReadingImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const imageRequest = useRef(0)
  const editing = source !== undefined

  useEffect(() => {
    const target = titleInputRef.current
    if (!target) return
    const frame = requestAnimationFrame(() => {
      target.focus({ preventScroll: true })
      target.scrollIntoView?.({ block: 'center' })
    })
    return () => {
      cancelAnimationFrame(frame)
      imageRequest.current += 1
    }
  }, [])

  async function handleImage(file: File | undefined): Promise<void> {
    const request = imageRequest.current + 1
    imageRequest.current = request
    if (!file) {
      setReadingImage(false)
      return
    }
    setReadingImage(true)
    setFileFeedback(`Reading ${file.name}…`)
    const result = await readImageFile(file)
    if (request !== imageRequest.current) return
    setReadingImage(false)
    if (result.kind === 'error') {
      setFileFeedback('')
      setError({ field: 'image', message: result.message })
      return
    }
    setAsset(result.dataUrl)
    setFileFeedback(`${file.name} · ${Math.max(1, Math.round(file.size / 1024))} KB`)
    setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (readingImage) return
    const formData = new FormData(event.currentTarget)
    const title = formData.get('title')
    const link = formData.get('link')
    const note = formData.get('note')
    const tags = formData.get('tags')
    const ruleIds = formData.getAll('rules')
    if (typeof title !== 'string' || typeof link !== 'string' || typeof note !== 'string' || typeof tags !== 'string') return
    if (asset === defaultAsset && link.trim() === '') {
      setError({ field: 'form', message: 'Add an image or a source link.' })
      return
    }

    const parsed = userSourceSchema.safeParse({
      id: source?.id ?? `user-${crypto.randomUUID()}`,
      title,
      link,
      note,
      asset,
      tags: parseTags(tags),
      license: 'Personal reference',
      owner: 'user',
      ruleIds,
      componentIds: ['button', 'card', 'input'],
    })
    if (!parsed.success) {
      const issue = parsed.error.issues[0]
      const path = issue?.path[0]
      const field: ErrorField = path === 'link' || path === 'note' || path === 'rules' || path === 'tags' || path === 'title' ? path : 'form'
      setError({ field, message: issue?.message ?? 'Check the form and try again.' })
      return
    }
    setSaving(true)
    if (!onSave(parsed.data)) setSaving(false)
  }

  const errorId = error ? 'source-composer-error' : undefined

  return <form className="source-composer" onSubmit={handleSubmit} aria-label={editing ? `Edit ${source.title}` : 'Add a source'}>
    <div className="composer-heading"><div><p className="kicker">YOUR ARCHIVE</p><h3>{editing ? 'Edit this source' : 'Add what moves you'}</h3></div><button className="icon-button" type="button" onClick={onCancel} aria-label="Close source form" disabled={saving}><X size={20} /></button></div>
    <div className="composer-fields">
      <label><span>Title</span><input ref={titleInputRef} name="title" defaultValue={source?.title} required maxLength={80} aria-invalid={error?.field === 'title' || undefined} aria-describedby={error?.field === 'title' ? errorId : undefined} /></label>
      <label><span>Source link</span><input name="link" type="url" defaultValue={source?.link} placeholder="https://…" aria-invalid={error?.field === 'link' || undefined} aria-describedby={error?.field === 'link' ? errorId : undefined} /></label>
      <label className="field-wide"><span>Why it matters</span><textarea name="note" defaultValue={source?.note} required maxLength={240} rows={3} aria-invalid={error?.field === 'note' || undefined} aria-describedby={error?.field === 'note' ? errorId : undefined} /></label>
      <label><span>Tags</span><input name="tags" defaultValue={source?.tags.join(', ')} placeholder="calm, editorial, blue" aria-invalid={error?.field === 'tags' || undefined} aria-describedby={error?.field === 'tags' ? errorId : undefined} /></label>
      <label className="file-field"><span>Image</span><input name="image" type="file" accept="image/avif,image/gif,image/jpeg,image/png,image/webp" onChange={(event) => void handleImage(event.target.files?.[0])} aria-invalid={error?.field === 'image' || undefined} aria-describedby={error?.field === 'image' ? errorId : undefined} /><span className="file-feedback"><Image size={18} />{fileFeedback || (editing ? 'Keep current image or choose another' : 'Choose an image under 1.5 MB')}</span></label>
      {(asset !== defaultAsset || editing) && <div className="file-preview" aria-live="polite"><img src={asset} alt={fileFeedback ? `Preview of ${fileFeedback.split(' · ')[0]}` : `Current preview for ${source?.title ?? 'source'}`} /><span>{fileFeedback || 'Current image'}</span></div>}
    </div>
    <fieldset aria-invalid={error?.field === 'rules' || undefined} aria-describedby={error?.field === 'rules' ? errorId : undefined}><legend>Rule connections</legend><label><input type="checkbox" name="rules" value="color" defaultChecked={source?.ruleIds.includes('color') ?? true} /> Color</label><label><input type="checkbox" name="rules" value="type" defaultChecked={source?.ruleIds.includes('type')} /> Type</label><label><input type="checkbox" name="rules" value="shape" defaultChecked={source?.ruleIds.includes('shape')} /> Shape</label></fieldset>
    {error && <p className="form-error" id={errorId} role="alert">{error.message}</p>}
    <div className="composer-actions"><button className="quiet-action" type="button" onClick={onCancel} disabled={saving}>Cancel</button><button className="save-action" type="submit" disabled={saving || readingImage} aria-live="polite">{readingImage ? 'Reading image…' : saving ? 'Saving…' : editing ? 'Save changes' : 'Save source'} <Check size={18} weight="bold" /></button></div>
  </form>
}
