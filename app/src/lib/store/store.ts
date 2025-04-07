import { configureStore } from "@reduxjs/toolkit";

// Reducers
import user from "./features/user";
import deeplynx from "./features/deeplynx";
import server from "./features/server";
import report from "./features/report";
import ux from "./features/ux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      user,
      deeplynx,
      server,
      report,
      ux,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
