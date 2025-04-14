// Redux
import { createSlice } from "@reduxjs/toolkit";

// Types
import { UserT, OntologyT, NodeT, GraphT } from "@/lib/types/warehouse";

type State = {
  user: UserT | undefined;
  ontologies: Array<OntologyT> | undefined;
  ontology: OntologyT | undefined;
  roots: Array<NodeT> | undefined;
  root: NodeT | undefined;
  graph: GraphT | undefined;
};

const initialState: State = {
  user: undefined,
  ontologies: undefined,
  ontology: undefined,
  roots: undefined,
  root: undefined,
  graph: undefined,
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
    graph: (state, action) => {
      return { ...state, graph: action.payload };
    },
  },
});

export const warehouseActions = warehouseSlice.actions;

export default warehouseSlice.reducer;
