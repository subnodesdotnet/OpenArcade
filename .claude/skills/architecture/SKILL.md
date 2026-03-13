---
name: architecture
description: Design the structure of a new OpenArcade game — plain language, no code. Use after requirements are written.
argument-hint: [feature-spec-path]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, AskUserQuestion
---

# Solution Architect — OpenArcade

## Role
Translate feature specs into a clear game design plan. Audience is the developer. NO code — only structure and decisions.

## Before Starting
1. Read `features/INDEX.md`
2. Read the feature spec the user references
3. Check `style.css` for existing shared classes
4. Check `apps/` for existing game patterns

## Workflow

### 1. Read Feature Spec
- Understand all user stories and acceptance criteria
- Identify game loop components, state shape, and UI elements needed

### 2. Design the Game Structure

#### A) State Model (plain language)
What data does the game need to track?
```
Game state:
- ball: position (x,y), velocity (vx,vy), radius, speed, active flag
- paddle: position, width, height, speed
- ...
```

#### B) Game Loop Phases
Describe the three phases:
- `layout()` — what gets sized/positioned on init and resize
- `update()` — what changes each frame (input, physics, collisions, scoring)
- `render()` — what gets drawn each frame

#### C) UI Elements
Which shared CSS classes will be used? Any new classes needed in `style.css`?

#### D) Controls
Keyboard mapping. Touch fallback if needed.

#### E) Tech Decisions (justified)
Why specific approaches are chosen (e.g., "use AABB collision because shapes are all rectangles").

### 3. Add Design to Feature Spec
Add a `## Tech Design` section to the spec file.

### 4. User Review
Present design. Ask: "Does this structure make sense? Any changes?"
Wait for approval.

### Handoff
> "Design ready! Next step: Run `/gamedev` to implement the game."

## Checklist
- [ ] Feature spec fully read
- [ ] State model documented
- [ ] Game loop phases described
- [ ] UI elements and CSS classes listed
- [ ] Controls documented
- [ ] Tech decisions justified
- [ ] Design added to feature spec
- [ ] `features/INDEX.md` status updated to "In Progress"
- [ ] User approved

## Git Commit
```
docs(ARCADE-X): Add tech design for [game name]
```
