# OpenArcade

> A browser-based arcade launcher — pure vanilla HTML/CSS/JavaScript, no build tools, no frameworks. Each game is a self-contained canvas app.

## Project Identity
- **Name:** OpenArcade
- **Copyright:** © 2026 New Media Studio
- **Location:** `/Users/maschine/Developer/OpenArcade/`

## Tech Stack

- **Runtime:** Vanilla HTML5 / CSS3 / JavaScript (ES6+)
- **Rendering:** Canvas 2D API
- **Styling:** Single shared `style.css` (CSS custom properties)
- **No build step, no bundler, no framework**

## Project Structure

```
OpenArcade/
  index.html          Main launcher (nav + canvas)
  style.css           Shared styles (menu, HUD, overlay, buttons)
  apps/
    openPong.js       Pong game module
    openBreakout.js   Breakout game module
  docs/
    PRD.md            Product Requirements Document
  features/
    INDEX.md          Feature status overview
    ARCADE-X-name.md  Individual feature specs
  .claude/
    rules/            Coding rules for this project
    skills/           Slash-command skill definitions
```

## Game Module Contract

Every game in `apps/` MUST follow this interface:

```js
// Exposes window.openXxx = { init }
// init receives { canvas, menuEl } and returns { destroy() }
window.openXxx = {
  init({ canvas, menuEl }) {
    // - Mount all UI DOM nodes to document.body
    // - Start rAF loop
    // - Listen to window events
    return {
      destroy() {
        // - cancelAnimationFrame
        // - removeEventListener (all listeners added)
        // - Remove all DOM nodes added
        // - Clear canvas to white
      }
    };
  }
};
```

**Non-negotiable rules for every game:**
- DPR-aware canvas sizing (always multiply by `window.devicePixelRatio`)
- Responds to `window resize` events (call `layout()`)
- Full `destroy()` — no memory leaks, no orphaned DOM, no lingering listeners
- White background (`#ffffff`) with black (`#000`) primary rendering
- Uses shared CSS classes from `style.css`: `.title`, `.hud`, `.overlay`, `.hint`, `.controls`, `.btn`
- Never touches the `<nav>` or the `<canvas id="game">` element directly (those belong to `index.html`)

## Development Workflow

1. `/requirements` — Write feature spec (WHAT, not HOW)
2. `/architecture` — Design game structure (plain language, no code)
3. `/gamedev` — Implement the game or feature
4. `/qa` — Test against acceptance criteria
5. `/deploy` — Ship (GitHub Pages or static host)

## Feature Tracking

All features in `features/INDEX.md`. Feature IDs: `ARCADE-1`, `ARCADE-2`, etc.
Commits: `feat(ARCADE-X): description`, `fix(ARCADE-X): description`

## Key Conventions

- **One game = one file** in `apps/openXxx.js`
- **Feature IDs:** ARCADE-1, ARCADE-2 (sequential)
- **Human-in-the-loop:** All workflows have user approval checkpoints
- **Read before modify:** Always read a file before editing it
- **No inline styles:** All styling via `style.css` shared classes or scoped CSS custom props

## Building for Deployment

```bash
./build.sh           # copies index.html, style.css, apps/*.js → dist/
```

`dist/` contains only the runtime files (no docs, features, .claude). Deploy the `dist/` folder.

## Serving Locally

```bash
# Serve from source (development)
npx serve .          # port 3000
python3 -m http.server 8080
open index.html      # direct file open also works

# Serve from dist (verify before deploy)
npx serve dist
```

## Product Context

@docs/PRD.md

## Feature Overview

@features/INDEX.md
