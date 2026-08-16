# Taste Archive Design System

## 0. Research Log

- Embedded refs: shortlisted Coinbase, Mastercard, and Pinterest -> picked `soft-skill` + Coinbase because the brief needs cobalt precision, calm physical depth, and a gallery-first archive without copying any brand identity.
- Lazyweb: 2 queries attempted, 0 screens viewed -> the server no longer advertises `lazyweb_search`; skipped because the read-only search tool is unavailable.
- UI/UX DB: queried `cream cobalt soft editorial design archive` -> retained exaggerated negative space, visible focus, 4px/8px rhythm, and WCAG guidance; rejected its pink accent and overly friendly font pairing.
- Imagen drafts: `docs/references/taste-archive-concept.png`, plus two alternates retained in the generation history -> picked `taste-archive-concept.png` because its large moodboard and right-side provenance rail make Source -> Rule -> Component relationships immediately legible.
- Distinctive direction: a curator's cobalt worktable on warm paper. The memorable moment is selecting a source tile and seeing its evidence path illuminate through the moodboard, rules, and component specimens.

## 1. Atmosphere & Identity

Taste Archive feels like a quiet museum study room rather than a software dashboard. Warm paper holds tactile reference material, while cobalt is reserved for navigation, selection, and traceability. The signature material is a double-bezel tray: a pale outer shell and concentric inner surface that makes moodboards and specimens feel physically catalogued.

Primary users are a visually curious maker learning to turn references into reusable UI rules and a keyboard/screen-reader user who needs the same provenance without relying on the visual connectors.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Canvas | `--color-canvas` | `#f4efe4` | Page background |
| Paper | `--color-paper` | `#fffdf8` | Primary cards and content |
| Paper cool | `--color-paper-cool` | `#edf2ff` | Selected/supporting surfaces |
| Paper warm | `--color-paper-warm` | `#e8dfcf` | Nested shells and dividers |
| Ink | `--color-ink` | `#17191f` | Headings and primary copy |
| Ink muted | `--color-ink-muted` | `#62646b` | Metadata and explanations |
| Cobalt | `--color-cobalt` | `#0b3fd8` | Primary actions, links, selected states |
| Cobalt hover | `--color-cobalt-hover` | `#245be7` | Hover states |
| Cobalt dark | `--color-cobalt-dark` | `#062a9a` | Active states and high-contrast labels |
| Cobalt mist | `--color-cobalt-mist` | `#dbe6ff` | Focused/selected supporting fill |
| Hairline | `--color-hairline` | `#d5cdbc` | Concentric frame details only |
| Error | `--color-error` | `#a8282b` | Validation errors with text/icon |

Rules:

- Cobalt is functional. It marks selection, focus, links, and causal connections, never ambient decoration.
- Text contrast meets WCAG 2.2 AA: Ink on Paper/Canvas and Paper on Cobalt.
- Surface hierarchy uses tonal shifts first, soft ambient depth second, and hairlines only inside the double-bezel construction.
- Components contain no raw color values; all colors resolve through these tokens.

## 3. Typography

| Level | Token | Size | Weight | Line height | Usage |
|---|---|---:|---:|---:|---|
| Display | `--type-display` | `clamp(3rem, 7vw, 6.5rem)` | 520 | 0.94 | Archive title and index numerals |
| H1 | `--type-h1` | `clamp(2rem, 4vw, 3.5rem)` | 520 | 1.02 | Story/page title |
| H2 | `--type-h2` | `clamp(1.5rem, 2.6vw, 2.25rem)` | 560 | 1.1 | Major groups |
| H3 | `--type-h3` | `1.25rem` | 650 | 1.25 | Card titles |
| Lead | `--type-lead` | `1.125rem` | 420 | 1.6 | Explanations |
| Body | `--type-body` | `1rem` | 430 | 1.6 | Default copy |
| Small | `--type-small` | `0.875rem` | 520 | 1.5 | Metadata |
| Label | `--type-label` | `0.75rem` | 650 | 1.3 | Uppercase labels, tracking `0.08em` |

- Display: Newsreader Variable, Georgia, serif.
- UI/body: Manrope Variable, system-ui, sans-serif.
- Maximum two families. Fonts are self-hosted through npm packages with no remote requests.
- Korean and English copy use natural phrase-aware wrapping; body text never drops below 14px.

## 4. Spacing & Layout

All intentional spacing is based on 4px.

| Token | Value | Usage |
|---|---:|---|
| `--space-1` | 4px | Hairline offsets |
| `--space-2` | 8px | Tight inline groups |
| `--space-3` | 12px | Labels and compact controls |
| `--space-4` | 16px | Mobile gutters and control padding |
| `--space-5` | 20px | Compact card gap |
| `--space-6` | 24px | Default card padding |
| `--space-8` | 32px | Component groups |
| `--space-10` | 40px | Page blocks |
| `--space-12` | 48px | Section boundaries |
| `--space-16` | 64px | Large section rhythm |
| `--space-20` | 80px | Desktop page top/bottom |

- Max content width: 1600px.
- Wide screens: 12-column grid; moodboard occupies 8 columns, provenance rail 4.
- Tablet: 8-column grid; provenance becomes a horizontal step rail.
- Mobile: single readable column at 375px with 16px gutters; no primary horizontal scroll.
- Browser mechanics may use intrinsic sizing and `clamp()` without tokenizing the mechanics.

## 5. Components

### ArchiveShell

- Structure: skip link -> header/step navigation -> main story canvas.
- States: active step, keyboard focus, compact mobile layout.
- Accessibility: landmarks, current location text, minimum 44px targets.

### BezelPanel

- Structure: outer shell -> inner surface -> optional heading/actions -> content.
- Variants: paper, cool, selected.
- States: default, focus-within, selected.
- Motion: tonal/transform feedback only; no decorative floating.

### SourceCard

- Structure: original SVG preview, title, origin/license metadata, evidence tags.
- States: default, hover, focus, selected.
- Accessibility: real button, `aria-pressed`, explicit license text, descriptive preview alt text.
- Stress: long title and long origin URL wrap without hiding provenance.

### MoodboardCanvas

- Structure: six source tiles in an asymmetric but DOM-linear grid, summary, palette strip.
- States: default, source-highlighted, empty explanation.
- Accessibility: ordered source list duplicates visual membership; never drag-only.

### RuleCard

- Structure: rule number, name, plain-language rationale, source evidence links, token specimen.
- States: default, linked-source highlighted, keyboard focus.

### ArchiveButton

- Variants: primary, secondary, quiet.
- States: default, hover, active, focus-visible, disabled, loading.
- Accessibility: semantic button, visible text, status announced during loading.

### ArchiveCard

- Variants: image, editorial, compact.
- States: default, hover, focus-within, selected, empty.
- Accessibility: heading hierarchy and link purpose remain clear without the image.

### ArchiveInput

- Variants: default, with helper text.
- States: default, hover, focus, filled, disabled, error.
- Accessibility: persistent label, associated helper/error text, no placeholder-only labeling.

### ProvenanceMap

- Structure: four semantic steps with counts and text summaries; visual connector is supplemental.
- States: current source, current rule, all paths.
- Accessibility: ordered list exposes the same relation to screen readers.

## 6. Motion & Interaction

| Token | Duration | Easing | Usage |
|---|---:|---|---|
| `--motion-micro` | 140ms | `cubic-bezier(.2,.8,.2,1)` | Press and focus feedback |
| `--motion-standard` | 260ms | `cubic-bezier(.2,.8,.2,1)` | Selection/path changes |
| `--motion-emphasis` | 480ms | `cubic-bezier(.16,1,.3,1)` | Initial provenance reveal |

- Animate only transform and opacity; selection also uses immediate color/outline changes for clarity.
- Selecting a SourceCard highlights related moodboard tiles, rules, and components. The motion explains causality.
- Reduced motion disables entrance translation and keeps instant semantic state changes.
- Hover never carries unique information; click, focus, and keyboard interactions provide the full path.

## 7. Depth & Surface

Strategy: mixed tonal shift plus a restrained ambient shadow for physical trays.

| Token | Value | Usage |
|---|---|---|
| `--shadow-subtle` | `0 1px 2px rgb(23 25 31 / 0.04), 0 8px 24px rgb(23 25 31 / 0.04)` | Cards |
| `--shadow-panel` | `0 2px 4px rgb(23 25 31 / 0.05), 0 22px 56px rgb(23 25 31 / 0.08)` | Moodboard tray |
| `--radius-control` | `14px` | Inputs and small controls |
| `--radius-card` | `22px` | Cards |
| `--radius-panel` | `32px` | Major trays |

- Every major tray uses concentric radii and a 6px outer shell.
- No glass blur, neon, harsh dark shadow, or generic one-pixel gray card border.

## 8. Accessibility Constraints & Accepted Debt

### Constraints

- WCAG 2.2 AA, 4.5:1 normal text, 3:1 large text and component boundaries.
- Full keyboard operation and visible focus on every interactive control.
- Screen-reader provenance is semantic text, never inferred from lines or color.
- `prefers-reduced-motion` is honored.
- 200% zoom and 375px width retain all source/license information.
- All source assets are original project SVGs or documented CC0/Public Domain assets.

### Accepted Debt

None. Any deferred design or accessibility issue must be added here with user approval.
