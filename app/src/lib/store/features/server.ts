// Redux
import { createSlice } from "@reduxjs/toolkit";

import { RawNodeDatum } from "react-d3-tree";

type State = {
  token: string | undefined;
  category: { id: string; metatype_name: string } | undefined;
  categories: Array<{ id: string; metatype_name: string }> | undefined;
  type: { id: string; class: string } | undefined;
  types: Array<{ id: string; class: string }> | undefined;
  batch: { cell_batch: string } | undefined;
  batches: Array<{ cell_batch: string }> | undefined;
  cell: { cell: string } | undefined;
  cells: Array<{ cell: string }> | undefined;
  data: Array<any> | undefined;
  graph: Array<RawNodeDatum> | undefined;
};

const initialState: State = {
  token: undefined,
  category: undefined,
  categories: undefined,
  types: undefined,
  type: undefined,
  batch: undefined,
  batches: undefined,
  cell: undefined,
  cells: undefined,
  data: undefined,
  graph: undefined,
};

const serverSlice = createSlice({
  name: "server",
  initialState: initialState,
  reducers: {
    token: (state, action) => {
      return { ...state, token: action.payload };
    },
    category: (state, action) => {
      return { ...state, category: action.payload };
    },
    categories: (state, action) => {
      return { ...state, categories: action.payload };
    },
    type: (state, action) => {
      return { ...state, type: action.payload };
    },
    types: (state, action) => {
      return { ...state, types: action.payload };
    },
    batch: (state, action) => {
      return { ...state, batch: action.payload };
    },
    batches: (state, action) => {
      return { ...state, batches: action.payload };
    },
    cell: (state, action) => {
      return { ...state, cell: action.payload };
    },
    cells: (state, action) => {
      return { ...state, cells: action.payload };
    },
    data: (state, action) => {
      return { ...state, data: action.payload };
    },
    graph: (state, action) => {
      return { ...state, graph: action.payload };
    },
  },
});

export const serverActions = serverSlice.actions;

export default serverSlice.reducer;
