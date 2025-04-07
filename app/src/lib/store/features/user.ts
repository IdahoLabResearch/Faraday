// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { PayloadAction } from "@reduxjs/toolkit";

type State = {
  auth: {
    code: string | undefined;
    token: string | undefined;
  };
};

const initialState: State = {
  auth: {
    code: undefined,
    token: undefined,
  },
};

const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    authenticate: (
      state,
      action: PayloadAction<{ code: string; token: string }>
    ) => {
      state.auth.code = action.payload.code;
      state.auth.token = action.payload.token;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
