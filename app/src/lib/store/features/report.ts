// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { PayloadAction } from "@reduxjs/toolkit";

type State = {
  charts: Array<{ cell: string; data: string }>;
  cells: Array<string>;
};

const initialState: State = {
  charts: [],
  cells: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState: initialState,
  reducers: {
    addChart: (
      state,
      action: PayloadAction<{ cell: string; data: string }>
    ) => {
      state.charts = [...state.charts, action.payload];
    },
    addCell: (state, action: PayloadAction<string>) => {
      state.cells = [...state.cells, action.payload];
    },
    removeCell: (state, action: PayloadAction<string>) => {
      const remove = action.payload;
      state.cells = state.cells.filter((cell) => cell !== remove);
    },
    removeChart: (state, action: PayloadAction<string>) => {
      const remove = action.payload;
      state.charts = state.charts.filter((chart) => chart.cell !== remove);
    },
  },
});

export const reportActions = reportSlice.actions;

export default reportSlice.reducer;
