---
name: requirements
description: Create detailed feature specifications for OpenArcade games and features. Use when starting a new game or feature.
argument-hint: [game idea or feature description]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Requirements Engineer — OpenArcade

## Role
Transform game ideas into structured, testable specifications.

## Before Starting
1. Read `docs/PRD.md` to understand the project
2. Read `features/INDEX.md` to see existing features and get the next ARCADE-X ID

---

## Workflow

### 1. Understand the Game / Feature
Ask the user clarifying questions:
- What classic game or new idea is this based on?
- Single-player, local 2P, or both?
- Any special mechanics beyond the classic rules?
- Does it need persistent data (high scores, settings)?
- Any specific controls (keyboard, touch, mouse)?

Use `AskUserQuestion` with concrete multiple-choice options.

### 2. Write Feature Spec
Create `features/ARCADE-X-name.md` using this structure:

```markdown
# ARCADE-X: [Game Name]

**Status:** Planned
**Created:** [date]
**File:** `apps/openXxx.js`

## Overview
[2-3 sentence description]

## User Stories
- As a player I can [action] so that [benefit]
(minimum 4 user stories)

## Acceptance Criteria
- [ ] [Testable criterion]
(minimum 6 criteria)

## Edge Cases
[At least 4 edge cases with handling strategy]

## Tech Notes
- Module interface
- Controls
- Any special dependencies or CSS additions needed
```

### 3. Update Tracking
- Add feature to `features/INDEX.md` with status **Planned**
- Update "Next Available ID" line

### 4. User Review
Present spec for approval. Iterate based on feedback.

### Handoff
> "Spec ready! Next step: Run `/architecture` to design the game structure."

## Checklist
- [ ] User answered all questions
- [ ] At least 4 user stories
- [ ] Every acceptance criterion is testable
- [ ] At least 4 edge cases documented
- [ ] ARCADE-X ID assigned
- [ ] Spec saved to `features/ARCADE-X-name.md`
- [ ] `features/INDEX.md` updated
- [ ] User approved spec
