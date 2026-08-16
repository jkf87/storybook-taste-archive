import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { App } from './App'

describe('Taste Archive overview', () => {
  it('shows the complete workflow when the archive opens', () => {
    // Given: the archive is rendered with its default reference set.
    render(<App />)

    // When: the visitor reads the overview.
    const heading = screen.getByRole('heading', { name: 'Taste Archive', level: 1 })

    // Then: every transformation stage is visible.
    expect(heading).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Sources' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Moodboard' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Rules' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Components' })).toBeVisible()
  })

  it('traces a selected source into related rules and components', async () => {
    // Given: a visitor opens the archive.
    const user = userEvent.setup()
    render(<App />)

    // When: the cobalt textile source is selected.
    await user.click(screen.getByRole('button', { name: /Cobalt textile/i }))

    // Then: its evidence path is announced and reflected in the relevant groups.
    expect(screen.getByRole('status')).toHaveTextContent(
      'Cobalt textile connects to 2 rules and 3 components',
    )
    expect(screen.getByRole('button', { name: /Cobalt textile/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByTestId('rule-color')).toHaveAttribute('data-related', 'true')
    expect(screen.getByTestId('component-button')).toHaveAttribute('data-related', 'true')
  })

  it('keeps the working-set state attached to the saved source', async () => {
    // Given: the cobalt reference is selected and saved.
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Add reference' }))

    // When: another source is selected.
    await user.click(screen.getByRole('button', { name: /Quiet arch/i }))

    // Then: that source remains available to add independently.
    expect(screen.getByRole('button', { name: 'Add reference' })).toBeVisible()
    expect(screen.queryByText('Quiet arch is in your working set.')).not.toBeInTheDocument()
  })
})
