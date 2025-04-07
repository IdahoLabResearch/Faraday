// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
type State = {
  token: string | undefined;
};

const initialState: State = {
  token: undefined,
};

const deeplynxSlice = createSlice({
  name: "deeplynx",
  initialState: initialState,
  reducers: {
    token: (state, action) => {
      return { ...state, token: action.payload };
    },
  },
});

export const deeplynxActions = deeplynxSlice.actions;

export default deeplynxSlice.reducer;
