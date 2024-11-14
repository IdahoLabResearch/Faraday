"use client";

import React, { createContext, useContext } from "react";
import { useAppSelector } from "@/lib/store/hooks";

// Types
import { NodeResponseT } from "../types/graphql";

let DataSourceContext = createContext<NodeResponseT>({} as NodeResponseT);

export default function ContainerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dataSource: NodeResponseT = useAppSelector(
    (state) => state.deeplynx.selectedCategory!
  );
  DataSourceContext = createContext(dataSource);

  return (
    <DataSourceContext.Provider value={dataSource}>
      {children}
    </DataSourceContext.Provider>
  );
}

// Custom hook to use the ThemeContext
export const useDataSource = () => useContext(DataSourceContext);
