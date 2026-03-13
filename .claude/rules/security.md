# Security Rules — OpenArcade

## Source Code
- No secrets, API keys, or credentials (this project has none — keep it that way)
- Never eval() user input or dynamically construct code strings
- Never use innerHTML with any user-controlled or external data

## Content Security
- All JS runs locally — no external script loads, no CDN dependencies
- No `fetch()` or `XMLHttpRequest` unless a feature explicitly requires it (document in PRD first)

## DOM Safety
- Use `textContent`, never `innerHTML`, for any dynamic text
- No `document.write()`

## Deployment
- Designed to run from file:// or any static host — no server-side logic
- No cookies, no localStorage persistence (unless a feature explicitly adds it)
