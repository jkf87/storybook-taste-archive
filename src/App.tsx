import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, Plus, Sparkle } from '@phosphor-icons/react'
import { archiveRules, archiveSources, componentNames, getSourceImageAlt, type ArchiveSource } from './archive-data'
import { SourceCard } from './SourceCard'
import { SourceComposer } from './SourceComposer'
import { loadArchiveState, saveArchiveState, type ArchiveState, type UserSource } from './user-sources'
import './App.css'
import './SourceManager.css'

type ComposerState = { readonly kind: 'closed' } | { readonly kind: 'create' } | { readonly kind: 'edit'; readonly source: UserSource }

export function App() {
  const addSourceButtonRef = useRef<HTMLButtonElement>(null)
  const restoreFocusTarget = useRef<HTMLElement | null>(null)
  const sourceButtonRefs = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusSourceId = useRef('')
  const [selectedId, setSelectedId] = useState('cobalt-textile')
  const [archiveState, setArchiveState] = useState<ArchiveState>(() => loadArchiveState(getBrowserStorage()))
  const [composer, setComposer] = useState<ComposerState>({ kind: 'closed' })
  const [pendingDeleteId, setPendingDeleteId] = useState('')
  const [archiveMessage, setArchiveMessage] = useState('')
  const allSources = useMemo<readonly ArchiveSource[]>(() => [...archiveSources, ...archiveState.sources], [archiveState.sources])
  const selected = useMemo(
    () => allSources.find((source) => source.id === selectedId) ?? archiveSources[0],
    [allSources, selectedId],
  )
  const selectedRuleIds = useMemo(() => new Set(selected?.ruleIds), [selected])
  const savedReferenceIds = useMemo(() => new Set(archiveState.savedReferenceIds), [archiveState.savedReferenceIds])

  useEffect(() => {
    const sourceId = pendingFocusSourceId.current
    if (!sourceId) return
    const target = sourceButtonRefs.current.get(sourceId)
    pendingFocusSourceId.current = ''
    if (!target) return
    return focusAndReveal(target)
  }, [archiveState])

  useEffect(() => {
    if (composer.kind !== 'closed') return
    const target = restoreFocusTarget.current
    if (!target) return
    restoreFocusTarget.current = null
    return focusAndReveal(target)
  }, [composer])

  if (!selected) return null
  const referenceSaved = savedReferenceIds.has(selected.id)

  function commitArchive(next: ArchiveState, message: string): boolean {
    const result = saveArchiveState(getBrowserStorage(), next)
    if (result.kind === 'error') {
      setArchiveMessage(result.message)
      return false
    }
    setArchiveState(next)
    setArchiveMessage(message)
    return true
  }

  function handleSourceSave(source: UserSource): boolean {
    const exists = archiveState.sources.some((candidate) => candidate.id === source.id)
    const sources = exists ? archiveState.sources.map((candidate) => candidate.id === source.id ? source : candidate) : [...archiveState.sources, source]
    pendingFocusSourceId.current = source.id
    if (commitArchive({ ...archiveState, sources }, exists ? `${source.title} was updated.` : `${source.title} was added.`)) {
      setSelectedId(source.id)
      restoreFocusTarget.current = null
      setComposer({ kind: 'closed' })
      return true
    }
    pendingFocusSourceId.current = ''
    return false
  }

  function handleEdit(source: ArchiveSource): void {
    const editable = archiveState.sources.find((candidate) => candidate.id === source.id)
    if (editable) {
      restoreFocusTarget.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setComposer({ kind: 'edit', source: editable })
    }
  }

  function handleDelete(source: ArchiveSource): void {
    if (pendingDeleteId !== source.id) {
      setPendingDeleteId(source.id)
      setArchiveMessage(`Press confirm delete to remove ${source.title}.`)
      return
    }
    const sources = archiveState.sources.filter((candidate) => candidate.id !== source.id)
    const savedIds = archiveState.savedReferenceIds.filter((id) => id !== source.id)
    pendingFocusSourceId.current = 'cobalt-textile'
    if (commitArchive({ ...archiveState, sources, savedReferenceIds: savedIds }, `${source.title} was deleted.`)) {
      setPendingDeleteId('')
      if (selectedId === source.id) setSelectedId('cobalt-textile')
    } else {
      pendingFocusSourceId.current = ''
    }
  }

  function handleCreate(): void {
    restoreFocusTarget.current = addSourceButtonRef.current
    setComposer({ kind: 'create' })
  }

  function handleComposerCancel(): void {
    setComposer({ kind: 'closed' })
  }

  function handleSaveReference(): void {
    if (!selected) return
    const nextIds = [...new Set([...archiveState.savedReferenceIds, selected.id])]
    commitArchive({ ...archiveState, savedReferenceIds: nextIds }, `${selected.title} was added to your working set.`)
  }

  return (
    <main>
      <header className="masthead">
        <a className="brand" href="#top">Taste Archive <span>01</span></a>
        <nav aria-label="Archive sections">
          <a href="#sources">Sources</a><a href="#moodboard">Moodboard</a><a href="#rules">Rules</a><a href="#components">Components</a>
        </nav>
        <a className="jump" href="#sources" aria-label="Jump to archive"><ArrowDown size={18} /></a>
      </header>

      <section className="hero" id="top">
        <p className="kicker"><Sparkle weight="fill" /> A living reference system</p>
        <h1>Taste Archive</h1>
        <p className="lede">Collect what moves you. Trace the reason. Turn a feeling into design decisions you can use again.</p>
        <div className="hero-meta"><span>{allSources.length} sources</span><span>1 moodboard</span><span>3 rules</span><span>3 components</span></div>
      </section>

      <section className="archive-section" id="sources">
        <div className="section-heading"><div><p className="kicker">01 / COLLECT</p><h2>Sources</h2></div><p>Choose a reference to reveal the line between inspiration and interface.</p></div>
        <div className="source-tools"><button ref={addSourceButtonRef} className="add-source-action" type="button" onClick={handleCreate}><Plus size={18} weight="bold" /> Add your source</button></div>
        {composer.kind !== 'closed' && <SourceComposer key={composer.kind === 'edit' ? composer.source.id : 'create'} source={composer.kind === 'edit' ? composer.source : undefined} onCancel={handleComposerCancel} onSave={handleSourceSave} />}
        <div className="source-grid">
          {allSources.map((source, index) => <SourceCard key={source.id} cardRef={(element) => { if (element) sourceButtonRefs.current.set(source.id, element); else sourceButtonRefs.current.delete(source.id) }} index={index} source={source} selected={source.id === selected.id} confirmDelete={pendingDeleteId === source.id} onDelete={handleDelete} onEdit={handleEdit} onSelect={(next) => setSelectedId(next.id)} />)}
        </div>
        <p className="selection-status" role="status">{selected.title} connects to {selected.ruleIds.length} rules and {selected.componentIds.length} components</p>
        <p className="archive-message" aria-live="polite">{archiveMessage}</p>
      </section>

      <section className="archive-section" id="moodboard">
        <div className="section-heading"><div><p className="kicker">02 / COMPOSE</p><h2>Moodboard</h2></div><p>The selected reference sits beside its color, words, and material cues.</p></div>
        <div className="moodboard">
          <div className="moodboard-image"><img src={selected.asset} alt={getSourceImageAlt(selected)} width="800" height="600" /></div>
          <blockquote>“{selected.note}”</blockquote>
          <div className="swatch" aria-label="Cobalt color swatch"><span>#0B3FD8</span></div>
          <div className="material-note"><span>{selected.owner === 'user' ? 'your tags' : 'material / 01'}</span><strong>{selected.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}<br /></span>)}</strong>{selected.link && <a href={selected.link} target="_blank" rel="noreferrer">Open source <ArrowUpRight size={15} /></a>}</div>
        </div>
      </section>

      <section className="archive-section" id="rules">
        <div className="section-heading"><div><p className="kicker">03 / DISTILL</p><h2>Rules</h2></div><p>References become useful when the observation is specific enough to repeat.</p></div>
        <div className="rule-list">
          {archiveRules.map((rule) => <article key={rule.id} data-testid={`rule-${rule.id}`} data-related={selectedRuleIds.has(rule.id)}><p>{rule.eyebrow}</p><h3>{rule.title}</h3><span>{rule.detail}</span>{selectedRuleIds.has(rule.id) && <Check size={20} weight="bold" aria-label="Related to selected source" />}</article>)}
        </div>
      </section>

      <section className="archive-section components-section" id="components">
        <div className="section-heading"><div><p className="kicker">04 / APPLY</p><h2>Components</h2></div><p>The archive ends in working interface specimens, not a folder of forgotten images.</p></div>
        <div className="component-grid">
          <article data-testid="component-button" data-related={selected.componentIds.includes('button')}><SpecimenLabel id="button" /><button className="primary-button" type="button" onClick={handleSaveReference}>{referenceSaved ? 'Reference added' : 'Add reference'} {referenceSaved ? <Check size={18} weight="bold" /> : <ArrowUpRight size={18} />}</button><a className="text-button" href="#sources">View source details</a><span className="component-status" aria-live="polite">{referenceSaved ? `${selected.title} is in your working set.` : ''}</span></article>
          <article data-testid="component-card" data-related={selected.componentIds.includes('card')}><SpecimenLabel id="card" /><div className="mini-card"><img src={selected.asset} alt="" /><span><small>SELECTED SOURCE</small><strong>{selected.title}</strong></span></div></article>
          <article data-testid="component-input" data-related={selected.componentIds.includes('input')}><SpecimenLabel id="input" /><label className="archive-input"><span>Source note</span><input defaultValue="One vivid note, plenty of air" /><small>Saved to Color rule</small></label></article>
        </div>
      </section>

      <footer><p>Taste Archive / Storybook reference system</p><p>Original SVG studies · CC0 1.0</p></footer>
    </main>
  )
}

function getBrowserStorage(): Storage | undefined {
  try {
    return window.localStorage
  } catch {
    return undefined
  }
}

function focusAndReveal(target: HTMLElement): () => void {
  const frame = requestAnimationFrame(() => {
    target.focus({ preventScroll: true })
    target.scrollIntoView?.({ block: 'center' })
  })
  return () => cancelAnimationFrame(frame)
}

function SpecimenLabel({ id }: { id: string }) {
  return <div className="specimen-label"><span>COMP / {id.toUpperCase()}</span><strong>{componentNames[id]}</strong></div>
}
