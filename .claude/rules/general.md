# General Rules — OpenArcade

## Feature Tracking
- Read `features/INDEX.md` before starting any work
- Feature specs live in `features/ARCADE-X-feature-name.md`
- Feature IDs are sequential: check INDEX.md for the next available number
- One feature per spec file (Single Responsibility)

## Git Conventions
- Commit format: `type(ARCADE-X): description`
- Types: feat, fix, refactor, test, docs, chore
- Check existing files before creating new ones

## Human-in-the-Loop
- Always ask for user approval before finalizing deliverables
- Present options as clear choices, not open-ended questions
- Never proceed to the next workflow phase without user confirmation

## Status Updates
- Update `features/INDEX.md` when feature status changes
- Update the feature spec header status field
- Valid statuses: Planned, In Progress, In Review, Deployed

## File Handling
- ALWAYS read a file before modifying it
- After context compaction, re-read files before continuing
- When unsure about current state, read `features/INDEX.md` first
- Never guess at file paths or class names — verify by reading

## Handoffs Between Skills
- After completing a skill, suggest the next skill to the user
- Format: "Next step: Run `/skillname` to [action]"
- Handoffs are always user-initiated, never automatic
