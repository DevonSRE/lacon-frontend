// What the API said, for the person who did the thing.
//
// Every endpoint answers with a message written for a reader: "Request
// rejected", "Request approved", "Case routed". A screen that replaces it with
// a word of its own throws that away: rejecting a user request told the Director
// General only "successfully", which says neither what happened nor to what
// (QA 2026-11-16, row 19).
//
// The fallback is for the rare answer with no message at all, and should read
// like something a person would say.
export function apiMessage(message: unknown, fallback: string): string {
  if (typeof message === "string" && message.trim() !== "") {
    return message.trim();
  }
  return fallback;
}
