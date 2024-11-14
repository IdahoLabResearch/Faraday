"use client";

import React, { createContext, useContext } from "react";
import { useAppSelector } from "@/lib/store/hooks";

let TokenContext = createContext<string>("");

export default function ContainerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token: string = useAppSelector((state) => state.deeplynx.token!);
  TokenContext = createContext(token);

  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}

// Custom hook to use the ThemeContext
export const useToken = () => useContext(TokenContext);
