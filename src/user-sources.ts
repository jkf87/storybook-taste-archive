import { z } from 'zod'
import { archiveSources, linkPlaceholderAsset } from './archive-data'

export const ARCHIVE_STORAGE_KEY = 'taste-archive:v1'
export const MAX_IMAGE_BYTES = 1_500_000
const supportedImageTypes = new Set(['image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp'])
const storedImageSchema = z.string().refine((value) => {
  if (value === linkPlaceholderAsset) return true
  const match = /^data:image\/(?:avif|gif|jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/u.exec(value)
  const payload = match?.[1]
  if (payload === undefined || payload.length % 4 !== 0) return false
  try {
    const decoded = atob(payload)
    return btoa(decoded) === payload && decoded.length <= MAX_IMAGE_BYTES
  } catch {
    return false
  }
}, 'Use a supported image or the link placeholder.')

const webLinkSchema = z.string().trim().refine(
  (value) => value === '' || (URL.canParse(value) && /^https?:\/\//u.test(value)),
  'Use a full http:// or https:// link.',
)

export const userSourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1).max(80),
  note: z.string().trim().min(1).max(240),
  asset: storedImageSchema,
  link: webLinkSchema,
  tags: z.array(z.string().trim().min(1).max(24)).max(8),
  license: z.literal('Personal reference'),
  owner: z.literal('user').default('user'),
  ruleIds: z.array(z.enum(['color', 'type', 'shape'])).min(1),
  componentIds: z.array(z.enum(['button', 'card', 'input'])),
}).superRefine((source, context) => {
  if (source.asset === linkPlaceholderAsset && source.link === '') {
    context.addIssue({ code: 'custom', message: 'Add an image or a source link.', path: ['link'] })
  }
})

const archiveStateSchema = z.object({
  version: z.literal(1),
  sources: z.array(userSourceSchema),
  savedReferenceIds: z.array(z.string()),
}).superRefine((state, context) => {
  const sourceIds = new Set(archiveSources.map((source) => source.id))
  state.sources.forEach((source, index) => {
    if (sourceIds.has(source.id)) {
      context.addIssue({ code: 'custom', message: 'Source IDs must be unique.', path: ['sources', index, 'id'] })
    }
    sourceIds.add(source.id)
  })
})

export type UserSource = z.infer<typeof userSourceSchema>
export type ArchiveState = z.infer<typeof archiveStateSchema>
export type StorageSaveResult = { readonly kind: 'success' } | { readonly kind: 'error'; readonly message: string }
export type ImageReadResult = { readonly kind: 'success'; readonly dataUrl: string } | { readonly kind: 'error'; readonly message: string }

export const emptyArchiveState: ArchiveState = { version: 1, sources: [], savedReferenceIds: [] }

export function loadArchiveState(storage: Pick<Storage, 'getItem'> | undefined): ArchiveState {
  if (!storage) return emptyArchiveState
  try {
    const raw = storage.getItem(ARCHIVE_STORAGE_KEY)
    if (!raw) return emptyArchiveState
    const decoded: unknown = JSON.parse(raw)
    const parsed = archiveStateSchema.safeParse(decoded)
    return parsed.success ? parsed.data : emptyArchiveState
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof DOMException) return emptyArchiveState
    throw error
  }
}

export function saveArchiveState(storage: Pick<Storage, 'setItem'> | undefined, state: ArchiveState): StorageSaveResult {
  if (!storage) return { kind: 'error', message: 'Browser storage is unavailable. Check your privacy settings and try again.' }
  try {
    storage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(state))
    return { kind: 'success' }
  } catch (error) {
    if (error instanceof DOMException) return { kind: 'error', message: 'Browser storage is full. Try a smaller image.' }
    throw error
  }
}

export function parseTags(value: string): readonly string[] {
  return [...new Set(value.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean))].slice(0, 8)
}

export function readImageFile(file: File): Promise<ImageReadResult> {
  if (!supportedImageTypes.has(file.type)) return Promise.resolve({ kind: 'error', message: 'Choose a PNG, JPEG, WebP, GIF, or AVIF image.' })
  if (file.size > MAX_IMAGE_BYTES) return Promise.resolve({ kind: 'error', message: 'Images must be smaller than 1.5 MB.' })

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(typeof reader.result === 'string' ? { kind: 'success', dataUrl: reader.result } : { kind: 'error', message: 'This image could not be read.' })
    })
    reader.addEventListener('error', () => resolve({ kind: 'error', message: 'This image could not be read.' }))
    reader.readAsDataURL(file)
  })
}
