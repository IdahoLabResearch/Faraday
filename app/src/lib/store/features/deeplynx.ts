// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { ContainerT, DataSourceT } from "@/lib/types/deeplynx";
import { EdgeResponseT, NodeResponseT } from "@/lib/types/graphql";

type State = {
  step: string;
  token: string | undefined;
  container: ContainerT | undefined;
  categories: Array<NodeResponseT>;
  selectedCategory: NodeResponseT | undefined;
  root: EdgeResponseT | undefined;
  types: Array<EdgeResponseT>;
  selectedType: EdgeResponseT | undefined;
  batches: Array<{ cell_batch: string }>;
  selectedBatch: string | undefined;
  cells: Array<{ cell: string }>;
  selectedCell: string | undefined;
  data: Array<any>;
};

const initialState: State = {
  step: "Category Selection",
  token: undefined,
  container: undefined,
  categories: [],
  selectedCategory: undefined,
  root: undefined,
  types: [],
  selectedType: undefined,
  batches: [],
  selectedBatch: undefined,
  cells: [],
  selectedCell: undefined,
  data: [],
};

const deeplynxSlice = createSlice({
  name: "deeplynx",
  initialState: initialState,
  reducers: {
    step: (state, action) => {
      return { ...state, step: action.payload };
    },
    token: (state, action) => {
      return { ...state, token: action.payload };
    },
    container: (state, action) => {
      return { ...state, container: action.payload };
    },
    root: (state, action) => {
      return { ...state, root: action.payload };
    },
    categories: (state, action) => {
      return { ...state, categories: action.payload };
    },
    selectedCategory: (state, action) => {
      return { ...state, selectedCategory: action.payload };
    },
    types: (state, action) => {
      return { ...state, types: action.payload };
    },
    selectedType: (state, action) => {
      return { ...state, selectedType: action.payload };
    },
    batches: (state, action) => {
      return { ...state, batches: action.payload };
    },
    selectedBatch: (state, action) => {
      return { ...state, selectedBatch: action.payload };
    },
    cells: (state, action) => {
      return { ...state, cells: action.payload };
    },
    selectedCell: (state, action) => {
      return { ...state, selectedCell: action.payload };
    },
    data: (state, action) => {
      return { ...state, data: action.payload };
    },
  },
});

export const deeplynxActions = deeplynxSlice.actions;

export default deeplynxSlice.reducer;
