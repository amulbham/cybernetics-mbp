import { AUTHOR, SOCIAL_LINKS } from '../consts';

// Sprint 11.1 — the one canonical Person identity for the site's author.
// Sprint 11.0's audit found this same real-world entity (Amul Bham)
// independently hand-typed as four separate Person shapes — ResearchLayout's
// Article.author, the homepage's standalone Person, the homepage WebSite's
// own thin `{ name }`-only author, and About's richer ProfilePage.mainEntity
// — with no shared @id and already-observed drift between them (About alone
// carried jobTitle/knowsAbout; the homepage WebSite's version didn't even
// have url/sameAs). This is the one shared projection every JSON-LD
// consumer reads from instead of hand-typing its own core.
//
// @id is the identity of the real-world entity; url is the canonical
// human-readable profile page — deliberately distinct properties even
// though both derive from the same /about/ route (never /about, no
// trailing-slash mismatch between consumers). Every consumer gets the full
// core object, never an `{ "@id": "..." }`-only reference — there's no
// observed consumer benefit yet from cross-block node merging, and the
// core is small enough that the self-contained form stays the clearer one.
// Reconsider only if the site adopts an explicit `@graph` or a real
// semantic consumer demonstrates it needs the reference form instead.
//
// This is a projection helper, not a second identity store: every fact it
// reads (name, sameAs) still comes from AUTHOR/SOCIAL_LINKS in consts.ts,
// unchanged — no PERSON_* or SCHEMA_AUTHOR duplicate constants. Contextual
// callers (About's jobTitle/knowsAbout) spread additional properties
// around this core themselves; that's legitimate per-context enrichment,
// not something this helper owns or should ever generalize into.
export function personIdentity(site: URL | undefined) {
	const aboutUrl = new URL('/about/', site).toString();
	return {
		'@type': 'Person' as const,
		'@id': new URL('#person', aboutUrl).toString(),
		name: AUTHOR.name,
		url: aboutUrl,
		sameAs: Object.values(SOCIAL_LINKS),
	};
}
