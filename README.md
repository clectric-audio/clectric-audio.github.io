# clectric.audio

The reveal site for **Current** — a groovebox built on real music history, by [clectric](https://clectric.diy).

Most grooveboxes sell *sounds*. Current sells *scenes*: every pack is a researched, cited slice of
music history, and the companion app **Soundings** maps the artists, instruments, studios, and labels
that produced the record.

## Stack

Pure static HTML/CSS/JS — no build step, no server. Served by GitHub Pages at **clectric.audio**.

```
index.html              # the page
assets/css/style.css    # all styles; palette lives in the :root vars at the top
assets/js/graph.js      # the interactive Soundings connection graph (vanilla SVG)
assets/js/main.js       # pack data, scroll reveals, nav state
CNAME                   # clectric.audio
.nojekyll               # serve files as-is (skip Jekyll)
```

## Local preview

No tooling required — just serve the folder statically:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Editing

- **Colors** — swap the values in the `PALETTE — swap me` block at the top of `assets/css/style.css`.
  Everything routes through those CSS custom properties.
- **Packs** — edit the `PACKS` array in `assets/js/main.js`.
- **Soundings graph** — edit the `NODES` / `EDGES` arrays in `assets/js/graph.js`. Keep every
  connection accurate and citable.
- **App Store CTA** — replace the placeholder `href="#get"` on the `[data-appstore]` links in
  `index.html` once the App Store URL is live.

Brand note: **clectric** is always lowercase. The product is **Current**; the companion app is **Soundings**.
