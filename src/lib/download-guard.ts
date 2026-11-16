/**
 * Run a download once, however many times it is asked for.
 *
 * The management report saved twice for a single click (QA 2026-11-16, row 59):
 * the work ran inside `startTransition`, which React is free to run again — an
 * async function there is not supported — and nothing stopped the second run
 * from saving a second copy.
 *
 * The guard is a closure rather than React state because state lands on the
 * next render and a re-run does not wait for one. Kept apart from the React
 * hook so the rule itself can be tested.
 */
export type SavedFile = { data: string; contentType: string; filename?: string };
export type DownloadAnswer = ({ success: true } & SavedFile) | { success: false; message: string };

export function makeDownloadGuard(
  save: (file: SavedFile) => void,
  onError: (message: string) => void = () => {},
  onBusy: (busy: boolean) => void = () => {}
) {
  let running = false;
  return async function run(fetchFile: () => Promise<DownloadAnswer>): Promise<void> {
    if (running) return;
    running = true;
    onBusy(true);
    try {
      const result = await fetchFile();
      if (!result.success) {
        onError(result.message);
        return;
      }
      save(result);
    } finally {
      running = false;
      onBusy(false);
    }
  };
}
