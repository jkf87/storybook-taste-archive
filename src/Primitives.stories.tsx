import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowUpRight } from '@phosphor-icons/react'
import './App.css'

type ButtonArgs = {
  label: string
  variant: 'primary' | 'quiet'
  disabled: boolean
}

function ArchiveButton({ label, variant, disabled }: ButtonArgs) {
  const className = variant === 'primary' ? 'primary-button' : 'text-button'
  return <button className={className} type="button" disabled={disabled}>{label}<ArrowUpRight size={18} /></button>
}

const meta = {
  title: 'Components/Button',
  component: ArchiveButton,
  args: { label: 'Add reference', variant: 'primary', disabled: false },
  argTypes: { variant: { control: 'inline-radio', options: ['primary', 'quiet'] } },
  decorators: [(Story) => <div style={{ width: 360, padding: 32, background: 'var(--color-cobalt)', borderRadius: 22 }}><Story /></div>],
} satisfies Meta<typeof ArchiveButton>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Quiet: Story = { args: { variant: 'quiet', label: 'View details' } }
export const Disabled: Story = { args: { disabled: true } }
