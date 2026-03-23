# Check. Check.

A mindful check-check of our awareness both internall and externally. Be well. 

A progressive web app (PWA) that surfaces a single random quote on every pull to refresh. Built for [EWU Be Well](https://inside.ewu.edu/bewell/).

---

## Features

- **Pull to refresh** — swipe down (or scroll up / press Space) to get a new quote
- **500 curated quotes** — covering resilience, mindfulness, self-care, growth, courage, and purpose
- **50 background colors** — generated in `oklch()` for perceptually uniform color across the full hue wheel
- **13 Fontshare serif fonts** — randomly selected on each refresh (Boska, Zodiak, Gambetta, Gambarino, Sentient, Erode, Bespoke Serif, Rowan, Author, Stardom, Melodrama, Tanker, Ranade)
- **Animated overlay** — soft drifting white orbs layered over the background
- **Installable PWA** — add to home screen on iOS and Android for a native app feel
- **Offline support** — service worker caches all assets and quotes

---

## Stack

| Concern | Implementation |
|---|---|
| Structure | HTML |
| Style | CSS (custom properties, `oklch()`, `@keyframes`) |
| Logic | Vanilla JavaScript (no frameworks) |
| Fonts | [Fontshare](https://www.fontshare.com) CDN |
| Offline | Service Worker + Cache API |
| AI | Claude to generate JSON data |

No build step. No dependencies. No bundler.

---

## Project structure

```
check-check/
├── index.html      # App shell
├── app.js          # Quote logic, pull-to-refresh, font & color randomisation
├── style.css       # All styles including overlay animation
├── quotes.json     # 500 quotes (text + author)
├── sw.js           # Service worker — install, activate, fetch
├── manifest.json   # PWA manifest
├── favicon.svg     # Bookmark-check icon
├── icon-192.svg    # PWA home screen icon (192 px)
└── icon-512.svg    # PWA home screen icon (512 px)
```

---

## Running locally

No build step required — serve the folder with any static file server.

```bash
# Python
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then open `http://localhost:8000`.

> **Note:** the service worker requires a secure context (`https://` or `localhost`) to register.

---

## Adding quotes

Open `quotes.json` and add objects to the array:

```json
{ "text": "Your quote here.", "author": "Author Name" }
```

Bump `CACHE_NAME` in `sw.js` after any change to ensure the updated file is served to returning visitors.

---

## License

Assets and code are for internal EWU use.
Fonts are served via [Fontshare](https://www.fontshare.com) under the [ITF Free Font License](https://www.fontshare.com/licenses/itf-ffl).
