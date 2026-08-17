# Taste Archive

A Storybook reference system for collecting visual taste and turning it into reusable design rules and interface components.

## What is inside

- Six original CC0 SVG references
- Add personal image or link references directly in the browser
- Tag, edit, and safely delete personal references
- Browser-local persistence with no account or remote database
- An interactive source → moodboard → rule → component trace
- Cream, cobalt, and soft rectangular visual language
- Storybook Canvas, Controls, Docs, and accessibility checks
- Netlify configuration for automatic deploys from `main`

## Local development

```bash
npm install
npm run storybook
```

The Vite overview is available with `npm run dev`. Validate changes with `npm test`, `npm run lint`, and `npm run build:storybook`.

## Using your archive

Open `Archive / Overview`, choose **Add your source**, and provide a title plus an image or source link. Personal uploads accept PNG, JPEG, WebP, GIF, or AVIF files up to 1.5 MB; link-only entries use the project's CC0 link placeholder instead of pretending another image belongs to the source. Notes, tags, and rule connections can be changed later from the personal card's **Edit** action. **Delete** requires a second confirmation press.

Personal references and working-set selections are stored only in the current browser. Clearing site data removes them; they are never uploaded to this repository or Netlify.

## Assets

All visuals in `public/assets/` are original SVG studies released under CC0 1.0. See [LICENSE-ASSETS.md](./LICENSE-ASSETS.md).
