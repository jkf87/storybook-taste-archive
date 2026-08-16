import type { StorybookConfig } from '@storybook/react-vite'

const config = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: ['../public'],
  docs: { autodocs: 'tag' },
} satisfies StorybookConfig

export default config
