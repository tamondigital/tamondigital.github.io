# tiedy theme

The look and behaviour every site under **tiedy.com** shares, so that 講經筆記 (`/dharma-notes/`), Dharma
Translations (`/dharma-translations/`) and any later app read as one place. It is taken from dharma-notes, the
reference implementation.

| File | What it holds |
|---|---|
| `tokens.css` | colours (light and dark), fonts, radius, page and rail widths |
| `chrome.css` | base styles, the header with its phone menu, text-size and light/dark controls, page widths, the 目次 rail, cards, pills, buttons, notice, segmented switch, footer |
| `chrome.js` | phone menu, light/dark toggle, text size (both remembered per device), 目次 highlight while reading |

## Using it in an app

The source of truth is this folder. An app keeps a **synced copy** (so its build never depends on the network or
on this repo being deployed) with a script that copies these three files in, e.g. `scripts/sync_theme.sh`.
Edit the theme here, then run every app's sync and rebuild; never edit an app's copy. App-specific styles go in
the app's own stylesheet, after the theme, and use the tokens (`var(--accent)`), never raw colours.

## Markup contract

In `<head>`, before any stylesheet paints, apply the saved choices (no flash of the wrong theme or size):

```html
<script>
  try {
    const t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t;
    const f = Number(localStorage.getItem("font-scale")); if (f) document.documentElement.style.fontSize = Math.round(f * 100) + "%";
  } catch (e) {}
</script>
```

The header (labels in the site's own language; dharma-notes uses 選單 / 字體 / 深淺):

```html
<a class="skip" href="#main">Skip to content</a>
<header class="site-head"><div class="site-head-inner">
  <a class="brand" href="…">Site name</a>
  <!-- optional: one quick link that stays in the phone bar; give its copy in the nav class="head-dup" -->
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="menu-icon" aria-hidden="true"></span>Menu</button>
  <nav id="site-nav" aria-label="Main">
    <a href="…">…</a>
    <span class="nav-settings">
      <span class="nav-label" aria-hidden="true">Text</span>
      <span class="font-size" role="group" aria-label="Text size">
        <button type="button" data-font="-1" aria-label="Smaller text">A<small>−</small></button>
        <button type="button" data-font="1" aria-label="Larger text">A<small>+</small></button>
      </span>
      <button class="theme-toggle" type="button" aria-label="Light or dark">◐<span class="nav-label" aria-hidden="true">Light / dark</span></button>
    </span>
  </nav>
</div></header>
<main id="main" tabindex="-1" class="page">…</main>
<footer class="site-foot"><p>…</p></footer>
<script src="…/chrome.js" defer></script>
```

**Home link.** Every app's nav starts with a link back to the landing page (`https://tiedy.com/`; 首頁 / Home).
The landing page itself (`/index.html` in this repo) is built from this theme and is the model for a new app's
home: `.hero`, `.cards`, `.notice`.

## Layout rules

- **Widths.** `.page` (1080 px) for lists and prose; `.page.wide` (1280 px) for a reader with a rail. Side gutter
  16 px; nothing scrolls sideways on a phone.
- **Desktop (≥ 960 px wide and > 500 px tall).** A long text is a `.reader`: the **目次 rail** (`.side` holding a
  `nav.toc`) sticks on the left, 210 px, and the text keeps its own measure on the right. The rail lists the
  sections and, after a `li.toc-sep`, the page's other parts (glossary, notes). The entry being read is
  highlighted (`.toc a.on`, set by `chrome.js`).
- **Phone and narrow screens.** No rail. The same 目次 list is offered from the page's own sticky toolbar as a
  fold-out menu (`.narrow-only` hides it on desktop). The header folds into the menu button; touch targets are at
  least 44 px.
- **Switching views of one text** (e.g. Read / Side by side) is a `.seg-switch` in a toolbar directly above the
  text, after the page's introduction, never above it. Switching keeps the reader's place.
- **Light and dark** both come from the tokens; every new colour gets a dark value in `tokens.css`.

## Content rules shared by every app

- Anything made by AI says so on the page, with a link to how it is made.
- A teacher's words are shown as his words (his transcript, cited); a summary or translation is labelled as one.
- Every app is free to read and non-commercial; CBETA text carries its CC BY-NC-SA notice.
