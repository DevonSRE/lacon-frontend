import { useEffect, useRef } from "react";

// Lets a form action run once per submission. `isPending` only turns true after
// the next render, so a double-click submits twice before the button disables.
// The lock is released whenever `result` (the action's state) changes.
export default function useSubmitLock(result: unknown) {
  const locked = useRef(false);

  useEffect(() => {
    locked.current = false;
  }, [result]);

  return () => {
    if (locked.current) return false;
    locked.current = true;
    return true;
  };
}
