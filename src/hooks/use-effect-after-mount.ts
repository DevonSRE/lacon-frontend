// /src/hooks/use-effect-after-mount.ts
import { useEffect, useRef, DependencyList } from "react";

// useEffect should be called after the component is mounted

export default function useEffectAfterMount(
  fn: () => void,
  deps: DependencyList = []
) {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}
