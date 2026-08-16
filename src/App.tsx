import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Check, Sparkle } from '@phosphor-icons/react'
import { archiveRules, archiveSources, componentNames } from './archive-data'
import './App.css'

export function App() {
  const [selectedId, setSelectedId] = useState('cobalt-textile')
  const [savedReferenceIds, setSavedReferenceIds] = useState<ReadonlySet<string>>(() => new Set())
  const selected = useMemo(
    () => archiveSources.find((source) => source.id === selectedId) ?? archiveSources[0],
    [selectedId],
  )
  const selectedRuleIds = useMemo(() => new Set(selected?.ruleIds), [selected])

  if (!selected) return null
  const referenceSaved = savedReferenceIds.has(selected.id)

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
        <div className="hero-meta"><span>6 sources</span><span>1 moodboard</span><span>3 rules</span><span>3 components</span></div>
      </section>

      <section className="archive-section" id="sources">
        <div className="section-heading"><div><p className="kicker">01 / COLLECT</p><h2>Sources</h2></div><p>Choose a reference to reveal the line between inspiration and interface.</p></div>
        <div className="source-grid">
          {archiveSources.map((source, index) => (
            <button className="source-card" type="button" key={source.id} aria-pressed={source.id === selected.id} onClick={() => setSelectedId(source.id)}>
              <span className="source-index">0{index + 1}</span>
              <img src={source.asset} alt="" />
              <span className="source-copy"><strong>{source.title}</strong><small>{source.note}</small><em>{source.license}</em></span>
            </button>
          ))}
        </div>
        <p className="selection-status" role="status">{selected.title} connects to {selected.ruleIds.length} rules and {selected.componentIds.length} components</p>
      </section>

      <section className="archive-section" id="moodboard">
        <div className="section-heading"><div><p className="kicker">02 / COMPOSE</p><h2>Moodboard</h2></div><p>The selected reference sits beside its color, words, and material cues.</p></div>
        <div className="moodboard">
          <div className="moodboard-image"><img src={selected.asset} alt={`${selected.title} abstract reference`} /></div>
          <blockquote>“{selected.note}”</blockquote>
          <div className="swatch" aria-label="Cobalt color swatch"><span>#1746D1</span></div>
          <div className="material-note"><span>material / 01</span><strong>Warm paper<br />Bright signal<br />Quiet structure</strong></div>
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
          <article data-testid="component-button" data-related={selected.componentIds.includes('button')}><SpecimenLabel id="button" /><button className="primary-button" type="button" onClick={() => setSavedReferenceIds((current) => new Set(current).add(selected.id))}>{referenceSaved ? 'Reference added' : 'Add reference'} {referenceSaved ? <Check size={18} weight="bold" /> : <ArrowUpRight size={18} />}</button><a className="text-button" href="#sources">View source details</a><span className="component-status" aria-live="polite">{referenceSaved ? `${selected.title} is in your working set.` : ''}</span></article>
          <article data-testid="component-card" data-related={selected.componentIds.includes('card')}><SpecimenLabel id="card" /><div className="mini-card"><img src={selected.asset} alt="" /><span><small>SELECTED SOURCE</small><strong>{selected.title}</strong></span></div></article>
          <article data-testid="component-input" data-related={selected.componentIds.includes('input')}><SpecimenLabel id="input" /><label className="archive-input"><span>Source note</span><input defaultValue="One vivid note, plenty of air" /><small>Saved to Color rule</small></label></article>
        </div>
      </section>

      <footer><p>Taste Archive / Storybook reference system</p><p>Original SVG studies · CC0 1.0</p></footer>
    </main>
  )
}

function SpecimenLabel({ id }: { id: string }) {
  return <div className="specimen-label"><span>COMP / {id.toUpperCase()}</span><strong>{componentNames[id]}</strong></div>
}
