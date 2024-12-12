"use client";

import {AppStore, makeStore} from "@/lib/store";
import {useRef} from "react";
import {Provider} from "react-redux";
import {AppState, initialilzeApp} from "./slices/app-slice";

export default function StoreProvider({
  appState,
  children,
}: {
  appState: AppState;
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(initialilzeApp(appState));
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
