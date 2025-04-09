// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { CategoryT, TypeT, BatchT, CellT, UserT } from "@/lib/types/warehouse";

type State = {
  user: UserT | undefined;
  category: CategoryT | undefined;
  categories: Array<CategoryT> | undefined;
  type: TypeT | undefined;
  types: Array<TypeT> | undefined;
  batch: BatchT | undefined;
  batches: Array<BatchT> | undefined;
  cell: CellT | undefined;
  cells: Array<CellT> | undefined;
  data: Array<any> | undefined;
};

const initialState: State = {
  user: undefined,
  category: undefined,
  categories: undefined,
  types: undefined,
  type: undefined,
  batch: undefined,
  batches: undefined,
  cell: undefined,
  cells: undefined,
  data: undefined,
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: initialState,
  reducers: {
    user: (state, action) => {
      return { ...state, user: action.payload };
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
  },
});

export const warehouseActions = warehouseSlice.actions;

export default warehouseSlice.reducer;
