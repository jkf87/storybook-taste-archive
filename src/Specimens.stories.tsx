import type { Meta, StoryObj } from '@storybook/react-vite'
import './App.css'

function Specimens() {
  return <div className="component-grid" style={{ padding: 24, background: '#1746d1' }}>
    <article data-related="true"><div className="specimen-label"><span>COMP / CARD</span><strong>Reference card</strong></div><div className="mini-card"><img src="/assets/cobalt-textile.svg" alt="" /><span><small>SELECTED SOURCE</small><strong>Cobalt textile</strong></span></div></article>
    <article data-related="true"><div className="specimen-label"><span>COMP / INPUT</span><strong>Archive input</strong></div><label className="archive-input"><span>Source note</span><input defaultValue="One vivid note, plenty of air" /><small>Saved to Color rule</small></label></article>
  </div>
}

const meta = { title: 'Components/Card and input', component: Specimens, parameters: { layout: 'fullscreen' } } satisfies Meta<typeof Specimens>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
