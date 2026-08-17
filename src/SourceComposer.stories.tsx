import type { Meta, StoryObj } from '@storybook/react-vite'
import { linkPlaceholderAsset } from './archive-data'
import { SourceComposer } from './SourceComposer'

const editableSource = {
  id: 'storybook-personal-source',
  title: 'Blue reading room',
  note: 'Calm structure with one electric note.',
  asset: linkPlaceholderAsset,
  link: 'https://example.com/blue-room',
  tags: ['calm', 'editorial'],
  license: 'Personal reference',
  owner: 'user',
  ruleIds: ['color'],
  componentIds: ['button', 'card', 'input'],
} satisfies Parameters<typeof SourceComposer>[0]['source']

const meta = {
  title: 'Archive/Source composer',
  component: SourceComposer,
  args: { onCancel: () => undefined, onSave: () => true },
  decorators: [(Story) => <div style={{ padding: 24, background: 'var(--color-canvas)' }}><Story /></div>],
} satisfies Meta<typeof SourceComposer>

export default meta
type Story = StoryObj<typeof meta>

export const Create: Story = {}
export const Edit: Story = { args: { source: editableSource } }
