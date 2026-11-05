# RMR Open — how to build with this design system

This DS ships **styles only — no React components**. It is the dark-steel
visual language of a weekly Puck (ice hockey) tournament site. Build your own
markup and style it with the classes and tokens below; every value is the
site's real, shipped CSS. All of it lives in `styles.css`'s import closure
(`fonts/fonts.css`, `_ds_bundle.css` — read those files before styling).

## Ground rules

- **Dark only.** Every screen sits on the abyss ground. Give the page root
  `background: var(--abyss); color: var(--steel-bright)`. Never design a
  light theme.
- **Fonts:** body text is `Geist` (sans); display/headings are `Cinzel`
  (serif), weight 600–700, UPPERCASE, wide letter-spacing (0.1em–0.25em).
  Both families ship as `@font-face` — use them by name.
- **Color only via tokens** — no new hex values: `--abyss` (page ground),
  `--charcoal` / `--charcoal-light` (raised surfaces), `--card` (panel
  ground), `--steel-bright` (primary text), `--steel` (secondary text),
  `--steel-dark` (borders/dividers), `--muted` (captions/labels),
  `--blade-red` (live + danger accent, used sparingly), `--blade-blue`
  (rare secondary accent).

## Class vocabulary (all defined in `_ds_bundle.css`)

- **Typography:** `.rmr-title` (Cinzel page/section title; modifiers
  `.rmr-title--hero`, `.rmr-title--section`), `.rmr-eyebrow` (small
  wide-tracked caption), `.rmr-label` (field/table labels), `.rmr-live`
  (red live indicator text). Put a title between fading hairlines by
  wrapping it in `.rmr-rule-title` — the site's page-header treatment.
- **Panels:** `.rmr-card` — the signature panel: 1px `--steel-dark` frame
  with bright 10px corner ticks on the `--card` ground. The bare frame for
  any element is `.steel-frame`. Hero sections get `.hero-atmosphere`
  (faint red/blue radial glow backdrop).
- **Tables:** `<table class="rmr-table">` — headers are tracked-uppercase
  muted labels, rows divide with faint steel hairlines and tint on hover.
  Add `is-num` to numeric `th`/`td` (right-aligned, tabular digits) and
  `is-key` to the cell that matters (names, points). `.rmr-table--striped`
  adds alternating row shading. A flat list with the same dividers +
  shading: `<ul class="rmr-list">`.
- **Controls:** `.rmr-button` (framed, tracked-uppercase default action),
  `.rmr-button--danger` (blade-red, high-stakes actions like check-in),
  `.rmr-button--ghost` (quiet text action), `.rmr-input` (bordered field
  on abyss), `.rmr-input--underline` (inline editing).

## Idiomatic example

```jsx
<main style={{ background: "var(--abyss)", color: "var(--steel-bright)", fontFamily: "Geist, sans-serif", padding: "3rem" }}>
  <header className="rmr-rule-title"><h1 className="rmr-title">Leaderboard</h1></header>
  <p className="rmr-eyebrow" style={{ textAlign: "center", marginTop: ".75rem" }}>RMR Open — Week 4</p>
  <section className="rmr-card" style={{ marginTop: "2.5rem" }}>
    <table className="rmr-table">
      <thead><tr><th>Player</th><th className="is-num">G</th><th className="is-num">A</th><th className="is-num">Pts</th></tr></thead>
      <tbody>
        <tr><td className="is-key">ReaperMain</td><td className="is-num">12</td><td className="is-num">7</td><td className="is-num is-key">19</td></tr>
        <tr><td className="is-key">TopShelf</td><td className="is-num">9</td><td className="is-num">8</td><td className="is-num is-key">17</td></tr>
      </tbody>
    </table>
    <button className="rmr-button" style={{ marginTop: "1.5rem" }}>Register</button>
  </section>
</main>
```

Copy voice: terse, uppercase labels, hockey-tournament vocabulary
("puck drop", "check-in", "bracket") — see the table/eyebrow examples above.
