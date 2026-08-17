import { describe, expect, it } from 'vitest'
import { linkPlaceholderAsset } from './archive-data'
import { emptyArchiveState, loadArchiveState, parseTags, readImageFile, userSourceSchema } from './user-sources'

describe('personal archive storage', () => {
  it('returns an empty archive when stored JSON is malformed', () => {
    // Given: browser storage contains truncated JSON.
    const storage = { getItem: () => '{"version":' }

    // When: the archive crosses the storage boundary.
    const result = loadArchiveState(storage)

    // Then: the invalid record is discarded safely.
    expect(result).toEqual(emptyArchiveState)
  })

  it('normalizes duplicate and spaced tags', () => {
    // Given: a comma-separated tag entry contains duplicates and uneven casing.
    const value = ' Calm, editorial, calm, BLUE '

    // When: the tag entry is parsed.
    const result = parseTags(value)

    // Then: tags are unique, trimmed, and normalized.
    expect(result).toEqual(['calm', 'editorial', 'blue'])
  })

  it('discards stored sources with duplicate or reserved IDs', () => {
    // Given: stored data tries to shadow a curated source and repeat a personal ID.
    const source = { id: 'cobalt-textile', title: 'Shadow', note: 'Duplicate.', asset: linkPlaceholderAsset, link: 'https://example.com/shadow', tags: ['blue'], license: 'Personal reference', ruleIds: ['color'], componentIds: [] }
    const storage = { getItem: () => JSON.stringify({ version: 1, sources: [source, { ...source, id: 'user-1' }, { ...source, id: 'user-1' }], savedReferenceIds: [] }) }

    // When: the archive validates the stored collection.
    const result = loadArchiveState(storage)

    // Then: ambiguous identities are rejected at the boundary.
    expect(result).toEqual(emptyArchiveState)
  })

  it('discards a stored link placeholder without a link', () => {
    // Given: persisted data contains a placeholder that does not point anywhere.
    const source = { id: 'user-empty', title: 'Empty link', note: 'Missing origin.', asset: linkPlaceholderAsset, link: '', tags: ['empty'], license: 'Personal reference', ruleIds: ['color'], componentIds: [] }
    const storage = { getItem: () => JSON.stringify({ version: 1, sources: [source], savedReferenceIds: [] }) }

    // When: the stored archive crosses the schema boundary.
    const result = loadArchiveState(storage)

    // Then: the same image-or-link invariant used by the form is enforced on reload.
    expect(result).toEqual(emptyArchiveState)
  })

  it('rejects an image that is too large for browser storage', async () => {
    // Given: an image exceeds the documented storage limit.
    const file = new File([new Uint8Array(1_500_001)], 'large.png', { type: 'image/png' })

    // When: the image reader receives it.
    const result = await readImageFile(file)

    // Then: it returns an actionable error without reading the file.
    expect(result).toEqual({ kind: 'error', message: 'Images must be smaller than 1.5 MB.' })
  })

  it('rejects SVG uploads at the file boundary', async () => {
    // Given: a user-selected SVG could contain complex active content.
    const file = new File(['<svg/>'], 'drawing.svg', { type: 'image/svg+xml' })

    // When: the image reader validates its supported format.
    const result = await readImageFile(file)

    // Then: only the documented raster formats are accepted for personal uploads.
    expect(result).toEqual({ kind: 'error', message: 'Choose a PNG, JPEG, WebP, GIF, or AVIF image.' })
  })

  it('accepts only canonical stored images within the exact byte limit', () => {
    // Given: otherwise valid sources contain malformed, maximum, and oversized Base64 payloads.
    const source = { id: 'user-image', title: 'Image', note: 'Stored image.', link: '', tags: ['image'], license: 'Personal reference', owner: 'user', ruleIds: ['color'], componentIds: [] }
    const malformedLength = { ...source, asset: 'data:image/png;base64,A' }
    const malformedPadBits = { ...source, asset: 'data:image/png;base64,AB==' }
    const maximum = { ...source, asset: `data:image/png;base64,${'A'.repeat(2_000_000)}` }
    const oversized = { ...source, asset: `data:image/png;base64,${'A'.repeat(2_000_002)}==` }

    // When: each source crosses the persisted-image schema boundary.
    const results = [userSourceSchema.safeParse(malformedLength), userSourceSchema.safeParse(malformedPadBits), userSourceSchema.safeParse(maximum), userSourceSchema.safeParse(oversized)]

    // Then: malformed and oversized payloads fail while exactly 1.5 MB succeeds.
    expect(results.map((result) => result.success)).toEqual([false, false, true, false])
  })
})
