// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { PayloadAction } from "@reduxjs/toolkit";
import { NodeT } from "@/lib/types/warehouse";

type State = {
  charts: Array<{ node: NodeT; data: string }>;
  comparison: Array<NodeT>;
};

const initialState: State = {
  charts: [],
  comparison: [],
};

const reportSlice = createSlice({
  name: "report",
  initialState: initialState,
  reducers: {
    addChart: (state, action: PayloadAction<{ node: NodeT; data: string }>) => {
      state.charts = [...state.charts, action.payload];
    },
    addComparison: (state, action: PayloadAction<NodeT>) => {
      state.comparison = [...state.comparison, action.payload];
    },
    removeComparison: (state, action: PayloadAction<NodeT>) => {
      const remove = action.payload;
      state.comparison = state.comparison.filter(
        (node) => node.id !== remove.id
      );
    },
    removeChart: (state, action: PayloadAction<NodeT>) => {
      const remove = action.payload;
      state.charts = state.charts.filter(
        (chart) => chart.node.id !== remove.id
      );
    },
  },
});

export const reportActions = reportSlice.actions;

export default reportSlice.reducer;
