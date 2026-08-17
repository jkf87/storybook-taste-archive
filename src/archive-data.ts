export type ArchiveSource = {
  readonly id: string
  readonly title: string
  readonly note: string
  readonly asset: string
  readonly link: string
  readonly tags: readonly string[]
  readonly license: 'CC0 1.0' | 'Personal reference'
  readonly owner: 'curated' | 'user'
  readonly ruleIds: readonly string[]
  readonly componentIds: readonly string[]
}

export type ArchiveRule = {
  id: string
  eyebrow: string
  title: string
  detail: string
}

export const linkPlaceholderAsset = '/assets/link-reference.svg'

export function getSourceImageAlt(source: ArchiveSource): string {
  return source.asset === linkPlaceholderAsset ? `Link preview placeholder for ${source.title}` : `${source.title} visual reference`
}

export const archiveSources: readonly ArchiveSource[] = [
  { id: 'cobalt-textile', title: 'Cobalt textile', note: 'A saturated blue held by a warm, tactile ground.', asset: '/assets/cobalt-textile.svg', link: '', tags: ['color', 'textile'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['color', 'type'], componentIds: ['button', 'card', 'input'] },
  { id: 'paper-relief', title: 'Paper relief', note: 'Layered planes turn softness into a repeatable edge.', asset: '/assets/paper-relief.svg', link: '', tags: ['shape', 'paper'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['shape'], componentIds: ['card'] },
  { id: 'quiet-arch', title: 'Quiet arch', note: 'A small opening gives cobalt room to breathe.', asset: '/assets/quiet-arch.svg', link: '', tags: ['space', 'arch'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['color', 'shape'], componentIds: ['card', 'input'] },
  { id: 'ceramic-form', title: 'Ceramic form', note: 'Useful objects can feel generous without becoming cute.', asset: '/assets/ceramic-form.svg', link: '', tags: ['object', 'soft'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['shape'], componentIds: ['button', 'card'] },
  { id: 'botanical-line', title: 'Botanical line', note: 'An editorial serif introduces a human, collected rhythm.', asset: '/assets/botanical-line.svg', link: '', tags: ['line', 'editorial'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['type'], componentIds: ['card'] },
  { id: 'coastal-grid', title: 'Coastal grid', note: 'A restrained grid keeps vivid color from taking over.', asset: '/assets/coastal-grid.svg', link: '', tags: ['grid', 'contrast'], license: 'CC0 1.0', owner: 'curated', ruleIds: ['color'], componentIds: ['button', 'input'] },
]

export const archiveRules: readonly ArchiveRule[] = [
  { id: 'color', eyebrow: '01 / COLOR', title: 'One vivid note, plenty of air', detail: 'Use cobalt as an action or anchor. Let cream occupy most of the field.' },
  { id: 'type', eyebrow: '02 / TYPE', title: 'Editorial warmth, useful clarity', detail: 'Newsreader carries the point of view; Manrope keeps labels and metadata precise.' },
  { id: 'shape', eyebrow: '03 / SHAPE', title: 'Soft, never pillowy', detail: 'Corners sit between 12 and 24 pixels. Borders stay quiet and shadows stay close.' },
]

export const componentNames: Readonly<Record<string, string>> = {
  button: 'Button',
  card: 'Reference card',
  input: 'Archive input',
}
