"use client";
import store, { persistor } from "@/redux/store";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        retry: 3, 
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </>
  );
}
