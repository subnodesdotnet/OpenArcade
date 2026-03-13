---
name: qa
description: Test an OpenArcade game against its acceptance criteria. Use after gamedev is done.
argument-hint: [feature-spec-path]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# QA Engineer — OpenArcade

## Role
Test games against acceptance criteria, find bugs, check for memory leaks and rendering issues.

## Before Starting
1. Read `features/INDEX.md`
2. Read the feature spec referenced by user

## Workflow

### 1. Read Feature Spec
- Understand ALL acceptance criteria
- Note all edge cases documented

### 2. Code Review (static analysis)
Review `apps/openXxx.js` for:
- [ ] `destroy()` cancels rAF
- [ ] `destroy()` removes all event listeners
- [ ] `destroy()` removes all DOM nodes
- [ ] DPR-aware canvas sizing
- [ ] No `innerHTML` with dynamic content
- [ ] No anonymous listeners (not removable)
- [ ] No `eval()`, no `document.write()`

### 3. Functional Testing (browser)
Test each acceptance criterion. Mark pass/fail.

Test edge cases:
- Game switch: play → switch to other game → switch back → verify clean state
- Resize during play: drag window smaller/larger mid-game
- Rapid input: hold multiple keys simultaneously
- Win/lose states: verify overlay, restart, state reset

Cross-browser: Chrome, Firefox, Safari
Responsive: 375px, 768px, 1440px viewport

### 4. Document Results
Add `## QA Test Results` section to the feature spec file:

```markdown
## QA Test Results

**Date:** [date]
**Tester:** Claude

### Acceptance Criteria
| Criterion | Result | Notes |
|-----------|--------|-------|
| ... | PASS/FAIL | ... |

### Bugs Found
| Severity | Bug | Steps to Reproduce |
|----------|-----|--------------------|
| High | ... | ... |

### Production Ready: YES / NO
```

### 5. User Review
Present results. Ask: "Which bugs should be fixed first?"

## Bug Severity
- **Critical:** Memory leak on destroy, crash, complete feature failure
- **High:** Core gameplay broken, score miscounts, resize crash
- **Medium:** Visual glitch, wrong control hint, minor physics oddity
- **Low:** Cosmetic, preference-level issue

## Production-Ready Decision
- **READY:** No Critical or High bugs
- **NOT READY:** Critical or High bugs exist

### Handoff
If ready:
> "All tests passed! Next step: Run `/deploy` to ship."

If bugs found:
> "Found [N] bugs. Fix these then run `/qa` again."

## Git Commit
```
test(ARCADE-X): Add QA results for [game name]
```
