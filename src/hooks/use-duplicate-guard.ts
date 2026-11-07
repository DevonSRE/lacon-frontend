"use client";

import { useState } from "react";
import { possibleDuplicates } from "@/features/cases/server/duplicates";
import { hasDuplicates, type DuplicateMatch } from "@/lib/duplicates";

/**
 * Puts the duplicate check in front of a filing (T10).
 *
 * A form hands over the FormData it was about to submit; if the client already
 * has a case the data is held, the warning opens, and it is only submitted
 * once the filer has either cancelled or given a reason — which is attached as
 * `duplicate_reason` so the new case carries it.
 *
 * The check is a warning, not a gate: if it cannot be run, the filing goes
 * through. Only internal filings are checked, because the public form has no
 * authenticated caller to read earlier cases for.
 */
export default function useDuplicateGuard(submit: (data: FormData) => void) {
  const [matches, setMatches] = useState<DuplicateMatch[]>([]);
  const [held, setHeld] = useState<FormData | null>(null);
  const [checking, setChecking] = useState(false);

  /**
   * Run the check, then either submit or open the warning. `enabled` is false
   * for the public form, where it is skipped entirely.
   */
  const guard = async (data: FormData, { enabled = true }: { enabled?: boolean } = {}) => {
    if (!enabled) {
      submit(data);
      return;
    }
    setChecking(true);
    let found: DuplicateMatch[] = [];
    try {
      found = await possibleDuplicates(
        String(data.get("email") ?? ""),
        String(data.get("phone_number") ?? ""),
      );
    } finally {
      setChecking(false);
    }
    if (!hasDuplicates(found)) {
      submit(data);
      return;
    }
    setMatches(found);
    setHeld(data);
  };

  const cancel = () => {
    setHeld(null);
    setMatches([]);
  };

  const continueAnyway = (reason: string) => {
    if (!held) return;
    held.set("duplicate_reason", reason);
    const data = held;
    setHeld(null);
    setMatches([]);
    submit(data);
  };

  return { guard, cancel, continueAnyway, matches, checking, open: held !== null };
}
