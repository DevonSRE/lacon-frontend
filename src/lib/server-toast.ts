/**
 * What to show when the server refuses something.
 *
 * An endpoint answers with a short headline ("The request could not be
 * raised") and, under `data`, the reason a person needs to read ("We couldn't
 * send your request. Please ask the pro bono lawyer to register on the LACON
 * website."). Showing the headline and burying the reason underneath it meant
 * the sentence QA asked for was not what the screen said (QA 2026-11-16,
 * row 31).
 *
 * So a single reason becomes the message itself. Several reasons — which is
 * what a form with field errors answers — stay as a list under the headline,
 * where they read as a list.
 */
export function serverToast(
  message: unknown,
  errors: unknown
): { title: string; description?: string } {
  const fallback = headline(message);
  const details = readDetails(errors);

  if (details.length === 1) {
    return { title: details[0] };
  }
  if (details.length > 1) {
    return { title: fallback, description: details.join(", ") };
  }
  return { title: fallback };
}

function readDetails(errors: unknown): string[] {
  if (typeof errors === "string") {
    const only = errors.trim();
    return only === "" ? [] : [only];
  }
  if (errors && typeof errors === "object") {
    return Object.values(errors as Record<string, unknown>)
      .flat()
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter((value) => value !== "");
  }
  return [];
}

// The same reading as apiMessage, inlined: these modules carry no imports so
// the test runner can load them, which cannot resolve the "@/" alias.
function headline(message: unknown): string {
  if (typeof message === "string" && message.trim() !== "") {
    return message.trim();
  }
  return "Something went wrong";
}
