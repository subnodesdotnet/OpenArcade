# ARCADE-1: openPong

**Status:** Deployed
**Created:** 2026-03-13
**File:** `apps/openPong.js`

## Overview

Classic two-paddle Pong. Supports 1P vs CPU and local 2P. Runs on a shared fullscreen canvas.

## User Stories

- As a player I can start a game by pressing Space so that play begins immediately
- As a solo player I can play against a CPU opponent that tracks the ball realistically
- As two local players we can compete with P1 on W/S and P2 on ArrowUp/Down
- As a player I can toggle CPU/2P mode with an on-screen button at any time
- As a player I see the score for both sides in a HUD above the canvas
- As a player the game resizes correctly when I resize or rotate my browser window

## Acceptance Criteria

- [ ] Space starts/restarts a serve from center
- [ ] Ball speed increases slightly on paddle hit
- [ ] Ball angle varies based on where it hits the paddle
- [ ] Score increments correctly when ball exits left or right
- [ ] CPU AI tracks ball with slight jitter (not perfect)
- [ ] Mode toggle switches between CPU and 2P labels and behavior
- [ ] All DOM nodes removed and rAF cancelled on `destroy()`
- [ ] Canvas is DPR-aware (crisp on Retina)
- [ ] Window resize re-layouts without breaking game state

## Edge Cases

- Resize mid-rally: paddles and ball clamp to new dimensions
- Rapid Mode toggle during play: no duplicate event listeners
- Ball escaping canvas (speed too high): clamped by wall/paddle collision guards

## Tech Notes

- Module: `window.openPong = { init({ canvas }) }` → returns `{ destroy() }`
- Uses shared CSS classes: `.title`, `.hud`, `.score`, `.divider`, `.controls`, `.btn`, `.hint`, `.overlay`
- No external dependencies
