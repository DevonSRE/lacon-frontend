
/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

import { ROLES } from "./types/auth";

/**
 * An array of routes used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = [
  "/signin"
];

export const publicRoutes = [
  "/welcome",
  "/",
  "probuno",
  "/invitation",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for API routes
 * Routes that start with this prefix are used for API purpose only
 * @type {string}
 */
export const apiPrefix = "/api";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/case-filing";
export const defaultLoginRedirect = (role?: ROLES) => {
  switch (role) {
    case "PLATFORM ADMIN":
      return "/loading";
    default:
      return "/loading";
  }
};
