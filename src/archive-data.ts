export type ArchiveSource = {
  id: string
  title: string
  note: string
  asset: string
  license: 'CC0 1.0'
  ruleIds: readonly string[]
  componentIds: readonly string[]
}

export type ArchiveRule = {
  id: string
  eyebrow: string
  title: string
  detail: string
}

export const archiveSources: readonly ArchiveSource[] = [
  { id: 'cobalt-textile', title: 'Cobalt textile', note: 'A saturated blue held by a warm, tactile ground.', asset: '/assets/cobalt-textile.svg', license: 'CC0 1.0', ruleIds: ['color', 'type'], componentIds: ['button', 'card', 'input'] },
  { id: 'paper-relief', title: 'Paper relief', note: 'Layered planes turn softness into a repeatable edge.', asset: '/assets/paper-relief.svg', license: 'CC0 1.0', ruleIds: ['shape'], componentIds: ['card'] },
  { id: 'quiet-arch', title: 'Quiet arch', note: 'A small opening gives cobalt room to breathe.', asset: '/assets/quiet-arch.svg', license: 'CC0 1.0', ruleIds: ['color', 'shape'], componentIds: ['card', 'input'] },
  { id: 'ceramic-form', title: 'Ceramic form', note: 'Useful objects can feel generous without becoming cute.', asset: '/assets/ceramic-form.svg', license: 'CC0 1.0', ruleIds: ['shape'], componentIds: ['button', 'card'] },
  { id: 'botanical-line', title: 'Botanical line', note: 'An editorial serif introduces a human, collected rhythm.', asset: '/assets/botanical-line.svg', license: 'CC0 1.0', ruleIds: ['type'], componentIds: ['card'] },
  { id: 'coastal-grid', title: 'Coastal grid', note: 'A restrained grid keeps vivid color from taking over.', asset: '/assets/coastal-grid.svg', license: 'CC0 1.0', ruleIds: ['color'], componentIds: ['button', 'input'] },
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
