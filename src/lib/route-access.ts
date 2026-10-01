import { ROLES } from "@/types/auth";

// The API names these roles "PDSS UNIT HEAD" / "DIO UNIT HEAD" while ROLES uses
// "PDSS" / "DIO"; accept both so the guard never blocks a real unit head.
const PDSS = [ROLES.PDSS, "PDSS UNIT HEAD"];
const DIO = [ROLES.DIO, "DIO UNIT HEAD"];

const UNIT_HEADS = [
  ROLES.CIVIL_JUSTICE_DEPT,
  ROLES.CRIMINAL_JUSTICE_DEPT,
  ROLES.DECONGESTION_UNIT_HEAD,
  ROLES.OSCAR_UNIT_HEAD,
  ROLES.PREROGATIVE_OF_MERCY_UNIT_HEAD,
  ...PDSS,
  ...DIO,
];

/**
 * Which roles may open each protected route (and everything under it).
 * Shared by the sidebar (what to show) and middleware (what to allow).
 * Routes not listed here are not role-restricted.
 */
export const ROUTE_ACCESS: Record<string, string[]> = {
  "/cases": [
    ROLES.ADMIN,
    ROLES.DIRECTOR_GENERAL,
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ROLES.INTERNAL_PARALEGAL,
    ...UNIT_HEADS,
  ],
  "/users/all": [ROLES.PLATFORM_ADMIN, ROLES.ADMIN, ROLES.DIRECTOR_GENERAL],
  "/users/request": [ROLES.ADMIN, ROLES.DIRECTOR_GENERAL],
  "/users/lawyers": [ROLES.DECONGESTION_UNIT_HEAD],
  "/users/probuno-request": [ROLES.DECONGESTION_UNIT_HEAD],
  "/lawyers": [
    ROLES.ZONAL_DIRECTOR,
    ROLES.STATE_COORDINATOR,
    ROLES.CENTRE_COORDINATOR,
    ...UNIT_HEADS.filter((r) => r !== ROLES.DECONGESTION_UNIT_HEAD),
  ],
  "/reports": [ROLES.ADMIN, ROLES.PLATFORM_ADMIN, ROLES.DIRECTOR_GENERAL],
  "/settings": [ROLES.ADMIN],
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
