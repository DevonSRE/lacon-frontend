/**
 * Where Case Reviews lives in the sidebar.
 *
 * They are the periodic reports pro bono lawyers send on their cases, so they
 * belong under Cases. They sat under Users Role, beside Lawyers and Request,
 * where staff looking for case updates would not think to look (QA 2026-11-16,
 * row 71). The page keeps its address: only the way in changes.
 *
 * The role lists are passed in rather than imported, so this rule can be read
 * on its own.
 */

/** The offices that reach Cases through a sub-menu, because they have reviews. */
export function casesSubMenuRoles(caseRoles: string[], reviewRoles: string[]): string[] {
  return reviewRoles.filter(role => caseRoles.includes(role));
}

/**
 * The offices that keep the direct link to Cases, having no reviews to read.
 * Internal paralegals are left out here as they always were: their entry is
 * "Filed Cases".
 */
export function casesDirectRoles(caseRoles: string[], reviewRoles: string[]): string[] {
  return caseRoles.filter(
    role => role !== "INTERNAL PARALEGAL" && !reviewRoles.includes(role)
  );
}
