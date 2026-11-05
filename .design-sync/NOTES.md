# design-sync notes — RMR Open

- **Scope (user-set, 2026-11-05): style-only.** The user wants "the font, the
  table styles, the overall design of the site" — explicitly NOT the app
  components (Navbar, Countdown, Bracket, TeamShowcase, RegisterFlow,
  AdminGate are all excluded via `componentSrcMap`). This is a tokens-only
  sync: `styles.css` + fonts + conventions header carry the whole value.
- This repo is a Next.js **app**, not a packaged component library: no
  `dist/`, no `.d.ts` exports, app lives in the `rmr-open/` subfolder
  (config home is the repo root above it).
- Fonts (Cinzel display, Geist body) come from `next/font/google` — the
  woff2 files only exist after `npm run build`, under
  `rmr-open/.next/static/media/`. The sync keeps committed copies in
  `rmr-open/design-system/fonts/` with an authored `fonts.css`; refresh them from a
  fresh build if the font setup in `app/layout.tsx` changes.
- The site's table/list styling is Tailwind utility compositions inline in
  JSX (no CSS classes in the repo). `rmr-open/design-system/rmr.css` packages
  those exact values as semantic `.rmr-*` classes — values are copied
  verbatim from `app/history/page.tsx` (leaderboard table),
  `components/TeamShowcase.tsx` (divider list), and `app/globals.css`
  (steel-frame, hero-atmosphere, body defaults). If those sources change,
  re-derive rmr.css.
- Tokens are the `:root` block at the top of `rmr-open/design-system/rmr.css`, copied
  verbatim from `rmr-open/app/globals.css`.

## Re-sync risks

- `rmr.css` (tokens included at its top) is **derived copies** of values that live in
  the app (globals.css + inline utility classes). They do not update
  themselves — diff against the app's current styling on each re-sync.
- Font woff2s are copies of build output; a Next/font upgrade can change
  the files. Compare `.next/static/media/*.woff2` after a build.
- No components are synced, so there are no previews/grades to carry
  forward; the conventions header is the main thing to keep true.
- Build assumed node v22, npm ci against package-lock.json.
