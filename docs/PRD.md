# Product Requirements Document — OpenArcade

## Vision

OpenArcade is a browser-based arcade game launcher built with pure vanilla HTML/CSS/JavaScript. It hosts a growing collection of classic-style canvas games — all running in a single fullscreen canvas with a minimal shared navigation bar. No installs, no accounts, no build step. Just open and play.

## Target Users

- Casual players who want quick, no-friction browser games
- Developers learning canvas-based game development
- New Media Studio portfolio showcase

## Core Features (Roadmap)

| Priority | ID | Feature | Status |
|----------|----|---------|--------|
| P0 (MVP) | ARCADE-1 | openPong — 1P vs CPU + 2P local | Deployed |
| P0 (MVP) | ARCADE-2 | openBreakout — single-player brick breaker | Deployed |
| P1 | ARCADE-3 | _Next game (TBD)_ | Planned |

## Success Metrics

- Games load and run at 60fps on modern desktop browsers
- Each game has a working `destroy()` (no memory leaks when switching)
- Mobile playable (touch controls where applicable)
- Page loads under 1 second (no build step, no network dependencies)

## Constraints

- No frameworks, no bundlers, no npm dependencies at runtime
- All assets must be self-contained in the repo (no CDN)
- Must work by opening `index.html` directly (file:// protocol) as well as via HTTP

## Non-Goals

- No user accounts or leaderboards (this version)
- No networked multiplayer
- No mobile app packaging
- No ads or monetization
