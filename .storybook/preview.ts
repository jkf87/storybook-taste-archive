import type { Preview } from '@storybook/react-vite'
import '@fontsource-variable/manrope'
import '@fontsource-variable/newsreader'
import '../src/index.css'

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: { expanded: true },
    a11y: { test: 'error' },
    backgrounds: { default: 'cream', values: [{ name: 'cream', value: '#f5f0e5' }, { name: 'cobalt', value: '#1746d1' }] },
  },
  tags: ['autodocs'],
} satisfies Preview

export default preview
