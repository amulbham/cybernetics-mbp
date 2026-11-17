/**
 * The one definition of per-work licenses (T30.8).
 *
 * A work's license is decided in exactly one place, `effectiveLicense()`, and
 * every consumer reads its result: the masthead (and therefore the printed
 * PDF page 1, which is typeset from the same HTML), the page footer, the
 * JSON-LD `license` field, and the publishing-facts oracle's expectations.
 *
 * Forward default (T30.8, owner decision 2026-11-17): a new entry with no
 * `license` frontmatter is CC BY 4.0. Entries published before that decision
 * carry an explicit `license: 'cc-by-nc-4.0'` override in their frontmatter so
 * their effective license is unchanged. No work is ever relicensed
 * retroactively; a frozen PDF keeps the notice it was typeset with.
 *
 * Unsupported values fail the content schema (`z.enum(LICENSE_IDS)`); a
 * `scholarly` forward paper is CC BY 4.0 and may not be contradicted. Neither
 * case silently becomes a different license.
 *
 * The sitewide notice (`LICENSE` in `consts.ts`: footer on non-work pages, the
 * IWL companion line) is a different thing from a per-work license and is not
 * decided here.
 *
 * Plain-Node compatible (no `astro:content` import): loaded by the Astro/Vite
 * layer and by tsx-run scripts and tests.
 */
export const LICENSES = {
	'cc-by-4.0': {
		id: 'cc-by-4.0',
		label: 'CC BY 4.0',
		url: 'https://creativecommons.org/licenses/by/4.0/',
	},
	'cc-by-nc-4.0': {
		id: 'cc-by-nc-4.0',
		label: 'CC BY-NC 4.0',
		url: 'https://creativecommons.org/licenses/by-nc/4.0/',
	},
} as const;

export type LicenseId = keyof typeof LICENSES;
export type WorkLicense = (typeof LICENSES)[LicenseId];

/** Tuple form for `z.enum()`. */
export const LICENSE_IDS = Object.keys(LICENSES) as [LicenseId, ...LicenseId[]];

/** The default for a new entry with no explicit override. */
export const DEFAULT_LICENSE_ID: LicenseId = 'cc-by-4.0';

/** The license a forward `scholarly` paper carries (T29.5 governance). */
const SCHOLARLY_LICENSE_ID: LicenseId = 'cc-by-4.0';

export interface LicenseInputs {
	/** Explicit per-entry override from frontmatter. */
	license?: string;
	/** Present only on forward scholarly papers. */
	scholarly?: unknown;
}

/** True when the inputs contradict each other (a scholarly paper must be CC BY 4.0). */
export function licenseInputsConflict({ license, scholarly }: LicenseInputs): boolean {
	return Boolean(scholarly) && license !== undefined && license !== SCHOLARLY_LICENSE_ID;
}

/**
 * Resolve the effective license of one work. Throws on an unsupported value or
 * a contradiction instead of substituting another license.
 */
export function effectiveLicense(inputs: LicenseInputs): WorkLicense {
	const { license, scholarly } = inputs;
	if (license !== undefined && !(license in LICENSES)) {
		throw new Error(`Unsupported license ${JSON.stringify(license)}; supported: ${LICENSE_IDS.join(', ')}`);
	}
	if (licenseInputsConflict(inputs)) {
		throw new Error(`A scholarly paper is ${LICENSES[SCHOLARLY_LICENSE_ID].label}; license ${JSON.stringify(license)} contradicts it`);
	}
	const id = (license as LicenseId | undefined) ?? (scholarly ? SCHOLARLY_LICENSE_ID : DEFAULT_LICENSE_ID);
	return LICENSES[id];
}
