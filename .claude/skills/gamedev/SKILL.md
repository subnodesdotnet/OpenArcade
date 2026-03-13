---
name: gamedev
description: Implement a new game or feature in OpenArcade. Use after architecture is designed.
argument-hint: [feature-spec-path]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Game Developer — OpenArcade

## Role
Implement games and features following the module contract and coding rules.

## Before Starting
1. Read `features/INDEX.md`
2. Read the feature spec (including Tech Design section)
3. Read `style.css` to know available shared classes
4. Read an existing game (`apps/openPong.js`) to understand patterns

## Workflow

### 1. Read Spec + Design
- Understand state model, game loop phases, controls
- List all DOM elements to create/destroy
- List all event listeners to add/remove

### 2. Implement the Game File
Create `apps/openXxx.js`:

**Required structure:**
```js
(function () {
  function init({ canvas, menuEl }) {
    const ctx = canvas.getContext('2d');
    // 1. Create all DOM nodes (title, hud, overlay, hint, controls)
    // 2. Define state object
    // 3. layout() — DPR-aware sizing
    // 4. update() — input + physics + collision + scoring
    // 5. render() — clear + draw
    // 6. loop() — update(); render(); raf = requestAnimationFrame(loop)
    // 7. Add ALL event listeners (store references)
    // 8. Call layout(); loop();
    return {
      destroy() {
        cancelAnimationFrame(raf);
        // Remove all event listeners
        // Remove all DOM nodes
        // Clear canvas
      }
    };
  }
  window.openXxx = { init };
})();
```

### 3. Add to index.html Launcher
- Add a `<button>` in `<nav>` for the new game
- Add `<script src="apps/openXxx.js" defer></script>`
- Add `loadApp` handler in the DOMContentLoaded script

### 4. Test Checklist
Before handing to QA, verify:
- [ ] Game runs without console errors
- [ ] Switching to another game and back works cleanly (no leaked DOM/listeners)
- [ ] Resize during play doesn't break layout
- [ ] All acceptance criteria from spec are implemented

### 5. User Review
Tell user to open `index.html` in browser and test.
Ask: "Does it play correctly? Any issues?"

### Handoff
> "Implementation done! Next step: Run `/qa` to test against the acceptance criteria."

## Context Recovery
If context was compacted:
1. Re-read the feature spec
2. Read `features/INDEX.md`
3. Read the current state of `apps/openXxx.js` if partially written
4. Continue from where you left off

## Checklist
- [ ] Feature spec and tech design fully read
- [ ] Game file follows IIFE + module contract
- [ ] DPR-aware canvas sizing in `layout()`
- [ ] `window resize` handled
- [ ] All DOM nodes removed in `destroy()`
- [ ] All event listeners removed in `destroy()`
- [ ] rAF cancelled in `destroy()`
- [ ] Launcher `index.html` updated (button + script tag + loadApp case)
- [ ] No console errors on load or game switch
- [ ] User tested in browser and approved

## Git Commit
```
feat(ARCADE-X): Implement [game name]
```
