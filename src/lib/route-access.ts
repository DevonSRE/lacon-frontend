import { ROLES } from "@/types/auth";

const UNIT_HEADS: string[] = [
  ROLES.CIVIL_JUSTICE_DEPT,
  ROLES.CRIMINAL_JUSTICE_DEPT,
  ROLES.DECONGESTION_UNIT_HEAD,
  ROLES.OSCAR_UNIT_HEAD,
  ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD,
  ROLES.PDSS,
  ROLES.DIO,
];

/**
 * Which roles may open each protected route (and everything under it).
 * Shared by the sidebar (what to show) and middleware (what to allow).
 * Routes not listed here are not role-restricted.
 */
export const ROUTE_ACCESS: Record<string, string[]> = {
  "/cases": [
    ROLES.ADMIN,
    ROLES.PLATFORM_ADMIN,
    ROLES.LACON_LAWYER,
    ROLES.PRO_BONO_LAWYER,
    ROLES.EXTERNAL_PARALEGAL,
    ROLES.DIRECTOR_GENERAL,
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ROLES.INTERNAL_PARALEGAL,
    ROLES.STATISTICS,
    ...UNIT_HEADS,
  ],
  // Statistics reads the directory; every action on the page is hidden for them.
  "/users/all": [ROLES.PLATFORM_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR_GENERAL, ROLES.STATISTICS],
  // The request queue is an approval queue, and the Platform Admin works it
  // too (T2). It used to send them back to Home.
  "/users/request": [ROLES.ADMIN, ROLES.DIRECTOR_GENERAL, ROLES.PLATFORM_ADMIN],
  // What a field office asked for and what came back. The API already scopes
  // this to the caller's own requests (QA 2026-11-01, item 3).
  "/users/my-requests": [
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ...UNIT_HEADS,
  ],
  "/users/lawyers": [ROLES.DECONGESTION_UNIT_HEAD],
  "/users/probuno-request": [ROLES.DECONGESTION_UNIT_HEAD],
  // The periodic case reviews designated pro bono lawyers send in. The
  // Decongestion head reads them; the DG and the admins can look
  // (QA 2026-11-01 run 4, 13 Nov, row 32).
  "/users/probono-reviews": [
    ROLES.DECONGESTION_UNIT_HEAD,
    ROLES.DIRECTOR_GENERAL,
    ROLES.PLATFORM_ADMIN,
    ROLES.ADMIN,
  ],
  "/lawyers": [
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ROLES.STATISTICS,
    ...UNIT_HEADS.filter((r) => r !== ROLES.DECONGESTION_UNIT_HEAD),
  ],
  // The admin report reads /analytics/admin-*, which only these three may call.
  // Everyone else gets the role-scoped report instead (/analytics/summary),
  // which the API narrows from their own account: a zone, a state, a centre or
  // a unit. `policy.ReportScopeFor` has always answered all of them; the page
  // simply was not open to anyone but the DG and the admins
  // (QA 2026-11-01, item 25).
  "/reports": [
    ROLES.ADMIN,
    ROLES.PLATFORM_ADMIN,
    ROLES.DIRECTOR_GENERAL,
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ROLES.STATISTICS,
    ...UNIT_HEADS,
  ],
  // A pro bono lawyer's own Letter of Designation. The letter lived only under
  // /users, which they may not open, so the person it is addressed to was sent
  // away from it (QA 2026-11-01 run 4, 13 Nov, row 39).
  "/designation-letter": [ROLES.PRO_BONO_LAWYER],
  "/settings": [ROLES.ADMIN],
  // Zones, states and centres decide where cases are routed and who holds them,
  // so only a platform admin may change them (the API agrees).
  "/organisation": [ROLES.PLATFORM_ADMIN],
};

// "/users" itself is reachable by anyone allowed on one of its tabs.
ROUTE_ACCESS["/users"] = Array.from(
  new Set(
    Object.entries(ROUTE_ACCESS)
      .filter(([path]) => path.startsWith("/users/"))
      .flatMap(([, roles]) => roles)
  )
);

/** Longest matching protected prefix for a pathname, if any. */
function protectedPrefix(pathname: string): string | undefined {
  return Object.keys(ROUTE_ACCESS)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)[0];
}

export function canAccessRoute(role: string | undefined, pathname: string): boolean {
  const prefix = protectedPrefix(pathname);
  if (!prefix) return true;
  return !!role && ROUTE_ACCESS[prefix].includes(role);
}
