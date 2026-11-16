/**
 * Handing the browser a file to save, once per click.
 *
 * The management report downloaded twice for a single click (QA 2026-11-16,
 * row 59). The work ran inside `startTransition`, which React is free to run
 * more than once — an async function there is not supported — and nothing
 * stopped a second run from saving a second copy. The guard here is a ref
 * rather than the `busy` flag, because state lands on the next render and a
 * re-run does not wait for one.
 *
 * Several screens had their own copy of the blob-saving dance; this is the one
 * place it lives now.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import { makeDownloadGuard, type DownloadAnswer, type SavedFile } from "./download-guard";

export type { SavedFile };

/** Ask the browser to save a base64 payload under a name. */
export function saveBase64File(file: SavedFile, fallbackName: string): void {
  const bytes = Uint8Array.from(atob(file.data), char => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: file.contentType }));
  const link = document.createElement("a");
  link.href = url;
  link.download = file.filename || fallbackName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Give the browser the turn it needs to start reading the blob before the
  // URL stops meaning anything.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * `busy` for the button, and a `download` that runs its fetch once however many
 * times it is called before the first one finishes. The rule itself lives in
 * `download-guard.ts`, where it is tested.
 */
export function useFileDownload() {
  const [busy, setBusy] = useState(false);
  // The guard has to be created once and kept: its "already running" flag
  // lives inside it, so rebuilding it on a render would forget the run in
  // progress and let a second copy save. The per-call details go in a ref,
  // which the one guard reads when it needs them.
  const latest = useRef<{ fallback: string; onError: (message: string) => void }>({
    fallback: "download",
    onError: () => {},
  });
  const guard = useMemo(
    () =>
      makeDownloadGuard(
        file => saveBase64File(file, latest.current.fallback),
        message => latest.current.onError(message),
        setBusy
      ),
    []
  );

  const download = useCallback(
    (
      fetchFile: () => Promise<DownloadAnswer>,
      fallbackName: string,
      handleError: (message: string) => void
    ) => {
      latest.current = { fallback: fallbackName, onError: handleError };
      return guard(fetchFile);
    },
    [guard]
  );

  return { busy, download };
}
