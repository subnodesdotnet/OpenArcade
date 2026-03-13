# Game Development Rules — OpenArcade

## Module Contract (MANDATORY)
Every game file in `apps/` MUST:
1. Wrap everything in an IIFE: `(function () { ... })();`
2. Expose `window.openXxx = { init }` where `Xxx` matches the filename
3. `init({ canvas, menuEl })` must return `{ destroy() }`
4. `destroy()` must: cancel rAF, remove ALL event listeners, remove ALL added DOM nodes, clear canvas to white

## Canvas Rendering
- ALWAYS use DPR: `const dpr = Math.max(1, window.devicePixelRatio || 1)`
- Set `canvas.width = Math.floor(window.innerWidth * dpr)` and `.style.width = window.innerWidth + 'px'`
- Re-run `layout()` on every `window resize` event
- Draw coordinates are in physical pixels (multiply logical sizes by `dpr`)

## DOM / UI
- Create DOM nodes with `document.createElement`, append to `document.body`
- Use ONLY existing shared CSS classes from `style.css`: `.title`, `.hud`, `.score`, `.divider`, `.hint`, `.overlay`, `.controls`, `.btn`, `.btn.active`, `.hidden`
- Never add `<style>` tags or inline styles from JS — extend `style.css` instead
- Never touch `<nav id="appMenu">` or `<canvas id="game">` from inside a game module

## Event Listeners
- Store every listener reference so it can be removed in `destroy()`
- Use `{ passive: false }` only when calling `e.preventDefault()` inside
- Never use anonymous functions as listeners (can't be removed)

## Game Loop
- Use `requestAnimationFrame` — store the handle for cancellation
- Never use `setInterval` or `setTimeout` for the main loop
- Keep `update()` and `render()` clearly separated

## Performance
- Do not create new objects or arrays inside the rAF loop — mutate existing state objects
- Avoid layout thrashing: do not read DOM dimensions inside the loop
- Clear only the area that changed, or use full `fillRect` for simple games

## Styling Conventions
- White background (`#ffffff`), black primary (`#000`), muted gray (`var(--muted)` = `#555`)
- No color beyond black/white/gray unless a specific feature calls for it
- Font: inherited from `body` (`"Helvetica Neue", Helvetica, Arial, sans-serif`)
