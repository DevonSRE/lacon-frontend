// ./src/app/_app.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import LoadingScreen from "@/components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      {loading && <LoadingScreen />}
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </>
  );
}
