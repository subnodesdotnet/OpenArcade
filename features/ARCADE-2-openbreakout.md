# ARCADE-2: openBreakout

**Status:** Deployed
**Created:** 2026-03-13
**File:** `apps/openBreakout.js`

## Overview

Classic single-player brick-breaker. Player controls a paddle, destroys all bricks with a bouncing ball.

## User Stories

- As a player I can start a game by pressing Space
- As a player I control the paddle with left/right arrow keys (or A/D)
- As a player I see remaining lives and current score in a HUD
- As a player when all bricks are cleared I get a win state and can restart
- As a player when I lose all lives I see a game-over screen and can restart
- As a player the game resizes to fill my browser window correctly

## Acceptance Criteria

- [ ] Space starts the ball from the paddle
- [ ] Ball bounces off walls, ceiling, paddle, and bricks correctly
- [ ] Each brick destroyed increments score
- [ ] Losing the ball deducts one life; reaching 0 lives shows game over
- [ ] Clearing all bricks shows a win overlay
- [ ] Overlay prompts Space to restart; restart resets bricks, score, and lives
- [ ] All DOM nodes removed and rAF cancelled on `destroy()`
- [ ] Canvas is DPR-aware
- [ ] Window resize re-layouts cleanly

## Edge Cases

- Ball clipping through thin paddle at high speed: handled by velocity clamping or tunneling guard
- Resize during play: ball/paddle positions recalculate proportionally
- Last brick remaining and ball moving very fast: collision still registers

## Tech Notes

- Module: `window.openBreakout = { init({ canvas }) }` → returns `{ destroy() }`
- Uses shared CSS classes from `style.css`
- No external dependencies
