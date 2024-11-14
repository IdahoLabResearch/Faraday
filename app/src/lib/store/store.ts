import { configureStore } from "@reduxjs/toolkit";

// Reducers
import deeplynxReducer from "./features/deeplynx";

export const makeStore = () => {
  return configureStore({
    reducer: {
      deeplynx: deeplynxReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
