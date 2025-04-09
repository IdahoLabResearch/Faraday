import { configureStore } from "@reduxjs/toolkit";

// Reducers
import deeplynx from "./features/deeplynx";
import warehouse from "./features/warehouse";
import report from "./features/report";
import ux from "./features/ux";

export const makeStore = () => {
  return configureStore({
    reducer: {
      deeplynx,
      warehouse,
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
