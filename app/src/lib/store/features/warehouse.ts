// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { UserT, OntologyT, NodeT, GraphT } from "@/lib/types/warehouse";
import {
  ElectrolysisCellQueryResultT,
  ElectrolysisStackQueryResultT,
} from "@/lib/types/timeseries";

type State = {
  user: UserT | undefined;
  ontologies: Array<OntologyT> | undefined;
  ontology: OntologyT | undefined;
  roots: Array<NodeT> | undefined;
  root: NodeT | undefined;
  leaf: NodeT | undefined;
  graph: Array<GraphT> | undefined;
  data:
    | ElectrolysisCellQueryResultT
    | ElectrolysisStackQueryResultT
    | undefined;
};

const initialState: State = {
  user: undefined,
  ontologies: undefined,
  ontology: undefined,
  roots: undefined,
  root: undefined,
  leaf: undefined,
  graph: undefined,
  data: undefined,
};

const warehouseSlice = createSlice({
  name: "warehouse",
  initialState: initialState,
  reducers: {
    user: (state, action) => {
      return { ...state, user: action.payload };
    },
    ontologies: (state, action) => {
      return { ...state, ontologies: action.payload };
    },
    ontology: (state, action) => {
      return { ...state, ontology: action.payload };
    },
    roots: (state, action) => {
      return { ...state, roots: action.payload };
    },
    root: (state, action) => {
      return { ...state, root: action.payload };
    },
    leaf: (state, action) => {
      return { ...state, leaf: action.payload };
    },
    graph: (state, action) => {
      return { ...state, graph: action.payload };
    },
    data: (state, action) => {
      return { ...state, data: action.payload };
    },
  },
});

export const warehouseActions = warehouseSlice.actions;

export default warehouseSlice.reducer;
