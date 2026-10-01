# site/ — Claude context

Personal research hub for Amul Bham (amulbham.com): Astro 7, static output, Cloudflare Pages. Work lands on `staging`; production needs Amul's explicit go. This file is a dispatcher. Each owner below holds its own rules; read the owner before editing in its area.

## Site map (owners per `PLANNING.md` §3)

- Pipeline, routing, deploy reference: `AGENTS.md`
- What a research page is: `PUBLISHING.md`
- Content modules: `CONTENT-MODULES.md`
- Design system: `design-system/README.md`
- Pending work: `ROADMAP.md`
- History: `CHANGELOG.md`
- Planning procedure, roles, risk, review: `PLANNING.md`
- Ticket shape: `planning/templates/ticket-contract.md`
- New or audited research entries: `.claude/skills/content-manager/SKILL.md`

## Hard gates (read the owner heading first)

- Indexing: `AGENTS.md` "## Indexing state — READ BEFORE TOUCHING"; flip only on Amul's ask.
- Deploy and production: `AGENTS.md` "## Deploy workflow — staging → production".
- Design system: `AGENTS.md` "## Design system"; tokens before new CSS.
- Content-section transforms: `AGENTS.md` "### Content-section transforms — standing policy".

## Commands (run from `site/`)

- `npm run build`
- `npm run build:pdfs`
- `npm run validate:pdfs`
- `astro dev --background` (see `AGENTS.md` "## Development" for stop/status)

## Starting work

Read `ROADMAP.md`, the active sprint contract, and the active ticket. A sealed ticket at its seal commit is the Executor's only authority.
