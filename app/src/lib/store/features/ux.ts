// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { PayloadAction } from "@reduxjs/toolkit";

type State = {
  drawer: boolean;
  step: number;
  snackbar: boolean;
};

const initialState: State = {
  drawer: true,
  step: 0,
  snackbar: false,
};

const uxSlice = createSlice({
  name: "ux",
  initialState: initialState,
  reducers: {
    drawer: (state, action: PayloadAction<boolean>) => {
      state.drawer = action.payload;
    },
    step: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    snackbar: (state, action: PayloadAction<boolean>) => {
      state.snackbar = action.payload;
    },
  },
});

export const uxActions = uxSlice.actions;

export default uxSlice.reducer;
