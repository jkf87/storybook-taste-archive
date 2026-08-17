import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { App } from './App'
import { linkPlaceholderAsset } from './archive-data'

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
    const view = render(<App />)
    await user.click(screen.getByRole('button', { name: 'Add reference' }))

    // When: the archive is reopened and another source is selected.
    view.unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Reference added' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: /Quiet arch/i }))

    // Then: that source remains available to add independently.
    expect(screen.getByRole('button', { name: 'Add reference' })).toBeVisible()
    expect(screen.queryByText('Quiet arch is in your working set.')).not.toBeInTheDocument()
  })

  it('creates and persists a tagged image reference', async () => {
    // Given: the personal archive is empty.
    const user = userEvent.setup()
    const view = render(<App />)

    // When: a visitor adds a reference link with tags.
    await user.click(screen.getByRole('button', { name: 'Add your source' }))
    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveFocus())
    await user.type(screen.getByLabelText('Title'), 'Blue reading room')
    await user.type(screen.getByLabelText('Why it matters'), 'Calm structure with one electric note.')
    await user.type(screen.getByLabelText('Tags'), 'calm, editorial')
    const pngBytes = Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2WZ0AAAAASUVORK5CYII='), (character) => character.charCodeAt(0))
    await user.upload(screen.getByLabelText(/^Image/u), new File([pngBytes], 'blue.png', { type: 'image/png' }))
    expect(await screen.findByAltText('Preview of blue.png')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Save source' }))

    // Then: the source is visible, stored, and restored on the next visit.
    expect(await screen.findByRole('button', { name: 'Blue reading room' })).toBeVisible()
    await waitFor(() => expect(screen.getByRole('button', { name: /^Blue reading room$/u })).toHaveFocus())
    expect(screen.getByRole('button', { name: /^Blue reading room$/u })).toHaveAccessibleDescription(/Calm structure.*calm.*editorial.*Uploaded from this browser.*Personal reference/iu)
    expect(screen.getAllByText('calm')).not.toHaveLength(0)
    expect(localStorage.getItem('taste-archive:v1')).toContain('Blue reading room')
    view.unmount()
    render(<App />)
    expect(screen.getByRole('button', { name: 'Blue reading room' })).toBeVisible()
    expect(localStorage.getItem('taste-archive:v1')).toContain('data:image/png;base64,iVBORw0KGgo')
  })

  it('edits a personally owned reference', async () => {
    // Given: one personal reference exists in browser storage.
    localStorage.setItem('taste-archive:v1', JSON.stringify({ version: 1, sources: [{ id: 'user-1', title: 'Blue room', note: 'Quiet.', asset: linkPlaceholderAsset, link: 'https://example.com/room', tags: ['calm'], ruleIds: ['color'], componentIds: ['button', 'card', 'input'], license: 'Personal reference' }], savedReferenceIds: [] }))
    const user = userEvent.setup()
    render(<App />)

    // When: the owner changes its title.
    await user.click(screen.getByRole('button', { name: 'Edit Blue room' }))
    await waitFor(() => expect(screen.getByLabelText('Title')).toHaveFocus())
    await user.clear(screen.getByLabelText('Title'))
    await user.type(screen.getByLabelText('Title'), 'Cobalt room')
    await user.click(screen.getByRole('button', { name: 'Save changes' }))

    // Then: the revised title replaces the old one.
    expect(await screen.findByRole('button', { name: 'Cobalt room' })).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Blue room' })).not.toBeInTheDocument()
    await waitFor(() => expect(screen.getByRole('button', { name: /^Cobalt room$/u })).toHaveFocus())
  })

  it('deletes a personally owned reference', async () => {
    // Given: one personal reference exists in browser storage.
    localStorage.setItem('taste-archive:v1', JSON.stringify({ version: 1, sources: [{ id: 'user-1', title: 'Temporary room', note: 'Quiet.', asset: linkPlaceholderAsset, link: 'https://example.com/room', tags: ['calm'], ruleIds: ['color'], componentIds: ['button', 'card', 'input'], license: 'Personal reference' }], savedReferenceIds: [] }))
    const user = userEvent.setup()
    render(<App />)

    // When: the owner deletes the reference.
    await user.click(screen.getByRole('button', { name: 'Delete Temporary room' }))
    await user.click(screen.getByRole('button', { name: 'Confirm delete Temporary room' }))

    // Then: the reference and its persisted record are removed.
    expect(screen.queryByRole('button', { name: 'Temporary room' })).not.toBeInTheDocument()
    expect(localStorage.getItem('taste-archive:v1')).not.toContain('Temporary room')
    await waitFor(() => expect(screen.getByRole('button', { name: /^Cobalt textile$/u })).toHaveFocus())
  })

  it('recovers from storage failure without closing the form', async () => {
    // Given: the browser storage boundary rejects writes.
    const storage = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('quota') })
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Add your source' }))
    await user.type(screen.getByLabelText('Title'), 'Unstored source')
    await user.type(screen.getByLabelText('Source link'), 'https://example.com/source')
    await user.type(screen.getByLabelText('Why it matters'), 'This write will fail safely.')

    // When: the visitor starts saving and the write fails.
    await user.click(screen.getByRole('button', { name: 'Save source' }))

    // Then: the form stays open, reports the problem, and allows a retry or cancellation.
    expect(await screen.findByText('Browser storage is full. Try a smaller image.')).toBeVisible()
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save source' })).toBeEnabled())
    expect(screen.getByRole('button', { name: 'Close source form' })).toBeEnabled()
    storage.mockRestore()
  })

  it('stays usable when browser storage access is blocked', async () => {
    const storage = vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new DOMException('blocked') })
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Taste Archive', level: 1 })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Add your source' }))
    await user.type(screen.getByLabelText('Title'), 'Private source')
    await user.type(screen.getByLabelText('Source link'), 'https://example.com/private')
    await user.type(screen.getByLabelText('Why it matters'), 'This source remains editable while storage is blocked.')
    await user.click(screen.getByRole('button', { name: 'Save source' }))

    expect(await screen.findByText('Browser storage is unavailable. Check your privacy settings and try again.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Save source' })).toBeEnabled()
    storage.mockRestore()
  })
})
