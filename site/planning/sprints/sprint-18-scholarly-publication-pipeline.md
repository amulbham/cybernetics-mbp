# Sprint 18 — Scholarly Publication Pipeline

Status: EXECUTING
Risk ceiling: R3 (a later earned ticket may change public PDF identity); risk is assigned per ticket
Branch: `staging`
Depends on: Sprint 15 CLOSED on OPAQUE V1, `main @ 8e60f6b`
Unlocks: reusable scholarly artifact and rendering mechanics for the later Production Ready corpus pass
Inherits: `PLANNING.md` v1.1, `PUBLISHING.md`, `AGENTS.md`, and `ROADMAP.md` @ `8e60f6b`

## Core question

What reusable artifact and rendering changes does the published corpus actually require before the Production Ready pass?

## Outcome

An evidence-led publication pipeline for paper-specific PDF identity, credible scholarly PDFs, stable Scholar-facing checks, and reusable table behavior. T18.0 audits the current state; later work is authorized only after its findings are reviewed.

## Inherited truths

- The existing HTML/PDF publishing and validation pipeline is live; successful build validation does not establish visual print quality.
- The Article remains the scholarly object. IWL v1 retains its authored body and has no PDF. Sprint 15's OPAQUE V1 position remains closed.
- The Research Object MVP block in `ROADMAP.md` is directional. Later corpus/front-door and discovery phases have no sprint number or authorization.

## Hypotheses to test

- Moving from `paper.pdf` to a paper-specific filename may require compatibility handling for existing direct links.
- Repeated PDF and table problems may admit reusable fixes; isolated content issues may belong in the later Production Ready pass.
- Some artifact properties warrant mechanical validation, while typography and pagination may require visual QA.

## Hard constraints

- Product authority requires each paper PDF to retain recognizable identity when linked, shared, or saved: the target filename is `{existing canonical paper slug}.pdf` beside its article HTML. Derive that slug from the existing route/content identity used by `canonicalPath()`; do not invent a second title-slugging rule.
- The implementation must converge on one authoritative PDF URL per paper. T18.0 determines the smallest safe handling of the old `paper.pdf` path; it does not implement a migration.
- Distinguish Scholar/publication integrity from visual print quality. PDF QA covers published papers; table QA covers every published long-form page containing tables, including essays or IWLs where applicable. PDF table QA applies only where a PDF exists.
- Preserve the current Article/IWL, canonical, and indexing contracts unless an independently authorized later ticket changes them.

## Explicit exclusions

No public Article/IWL content rewrite, IWL PDF or inner schema, speculative validator, Home/About or article-by-article Production Ready scoring, crawl-policy change, Keystatic, graph UI, Sprint 16, or downstream ticket creation by numbering.

## Ticket sequence

| Ticket | Mode | Purpose | Depends on | Gate |
|---|---|---|---|---|
| `T18.0` | AUDIT / R2 | Inspect PDF identity, all published paper artifacts, live tables, and bounded known housekeeping | Sprint 15 CLOSED; Sprint 18 activation | CLOSED. Evidence report written. Recommendation is not authorization |
| `T18.1` | IMPLEMENTATION / R3 | Canonical `{entry.id}.pdf` plus a 301 from `paper.pdf`. No second file. No HTML URL change | T18.0 CLOSED; Amul's legacy-link decision | Staging must show 200 and unfollowed 301 before close |

Further operations depend on T18.0's evidence and a separate product/planning review. A PDF URL ticket, print/validator ticket, table-mechanics ticket, or bounded polish ticket may be merged, omitted, or reordered.

## Sprint-level acceptance criteria

- Paper-specific PDF identity is implemented safely, with one authoritative URL and an evidenced decision on old-link behavior.
- Repeated print and table defects are addressed through reusable mechanics where earned; article-specific editorial work remains identified for the later corpus pass.
- Stable scholarly invariants are validated mechanically where earned; visual artifact quality has an explicit manual QA method.
- Existing publication and search behavior remains correct, and no discovery/indexing gate is silently opened.

## Validation plan

T18.0 uses source/output inspection, the published corpus, PDF text and visual checks, representative screen widths, and a bounded documentation diff. Any later implementation ticket must name its own local/build, adversarial, deployed, and compatibility evidence proportional to its actual risk.

## Stop conditions

Return to Amul if migration changes canonical Article identity, old-link handling requires a material product tradeoff, table mechanics require unapproved author syntax or editorial meaning, a proposed validator asserts visual quality it cannot measure, or the work crosses the content or discovery boundaries.

## Exit state

The reusable publication pipeline is evidenced and ready to support a separate Production Ready corpus/front-door phase. That phase and route-aware discovery remain directional and unnumbered until independently planned. Sprint 18 does not itself declare any work Production Ready or open crawling.

## Canonical documentation targets

This sprint contract and earned tickets hold authority and evidence. Add only a short historical handoff to `planning/programs/research-object-arc-13-17.md`; retain Sprint 17 as deferred Keystatic. `ROADMAP.md` points to active Sprint 18 while keeping later phases directional. Update `PUBLISHING.md`, `AGENTS.md`, and `CHANGELOG.md` only when an earned implementation or closure changes their durable truth.
