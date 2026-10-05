import { z } from "zod";

export function register() {
  // Zod 4 reports a field missing from submitted FormData (e.g. an unselected
  // dropdown or radio) as "Invalid input: expected string, received undefined".
  // Show a readable message instead; schema-specific messages are unaffected.
  z.config({
    customError: (issue) =>
      issue.code === "invalid_type" && issue.input === undefined
        ? "This field is required"
        : undefined,
  });
}
