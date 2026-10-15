// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from "redux-persist";
import rootReducer from "./slices";

const persistConfig = {
  key: "root",
  storage,
  version: 2,
  whitelist: ["profile"],
  migrate: async (state: import("redux-persist").PersistedState) => {
    if (!state) return state;
    const persisted = state as typeof state & { profile?: unknown };
    return { _persist: state._persist, profile: persisted.profile } as typeof state;
  },
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
