"use client"; // This makes this file client-specific

import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
