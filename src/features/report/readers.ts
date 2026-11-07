import { ROLES } from "@/types/auth";

/**
 * Who reads the national report.
 *
 * The API opens /analytics/admin-* and /export/admin-* to these roles
 * (`policy.CanViewReport`); everyone else allowed on the page reads the
 * role-scoped report instead, which the API narrows from their own account.
 *
 * Statistics was added to the policy with the role itself (T1) but not here, so
 * the one account whose whole job is the national picture was shown the scoped
 * report.
 */
export const NATIONAL_READERS: string[] = [ROLES.ADMIN, ROLES.PLATFORM_ADMIN, ROLES.DIRECTOR_GENERAL, ROLES.STATISTICS];
