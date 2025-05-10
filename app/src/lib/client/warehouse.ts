// Environment
const base = import.meta.env.VITE_DJANGO_PROXY!;

// Types
import { OntologyT, NodeT, GraphT } from "../types/warehouse";

export const FetchOntologies = async () => {
  return await fetch(`${base}/warehouse/ontologies`, {
    method: "GET",
  }).then(async (response) => {
    const categories: { data: Array<OntologyT> } = await response.json();
    return categories.data;
  });
};

export const FetchRoots = async (ontology_id: number) => {
  return await fetch(`${base}/warehouse/roots/${ontology_id}`, {
    method: "GET",
  }).then(async (response) => {
    const roots: { data: Array<NodeT> } = await response.json();
    return roots.data;
  });
};

export const FetchGraph = async (root_id: number) => {
  return await fetch(`${base}/warehouse/tree/${root_id}`, {
    method: "GET",
  }).then(async (response) => {
    const graph: { data: Array<GraphT> } = await response.json();
    // Return the children of the selected root
    return graph.data;
  });
};
