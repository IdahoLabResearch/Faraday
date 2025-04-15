// Environment
const base = import.meta.env.VITE_DJANGO_PROXY;

// Types
import { CategoryT, TypeT, BatchT, CellT } from "../types/warehouse";
import { OntologyT, NodeT, GraphT } from "../types/warehouse";

export const FetchOntologies = async () => {
  const url = new URL(`${base}/warehouse/ontologies`);

  return await fetch(url, {
    method: "GET",
  }).then(async (response) => {
    const categories: { data: Array<OntologyT> } = await response.json();
    return categories.data;
  });
};

export const FetchRoots = async (ontology_id: number) => {
  const url = new URL(`${base}/warehouse/roots/${ontology_id}`);

  return await fetch(url, {
    method: "GET",
  }).then(async (response) => {
    const roots: { data: Array<NodeT> } = await response.json();
    return roots.data;
  });
};

export const FetchGraph = async (root_id: number) => {
  const url = new URL(`${base}/warehouse/tree/${root_id}`);

  return await fetch(url, {
    method: "GET",
  }).then(async (response) => {
    const graph: { data: GraphT } = await response.json();
    // Return the children of the selected root
    return graph.data.children;
  });
};

export const FetchCategories = async () => {
  const url = new URL(`${base}/warehouse/categories`);

  return await fetch(url, {
    method: "GET",
  }).then(async (response) => {
    const categories: { data: Array<CategoryT> } = await response.json();
    return categories.data;
  });
};

export const FetchTypes = async (category: number) => {
  const url = new URL(`${base}/warehouse/types`);

  return await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      category: category,
    }),
  }).then(async (response) => {
    const types: { data: Array<TypeT> } = await response.json();
    return types.data;
  });
};

export const FetchBatches = async () => {
  const url = new URL(`${base}/warehouse/batches`);

  return await fetch(url, {
    method: "GET",
  }).then(async (response) => {
    const batches: { data: Array<BatchT> } = await response.json();
    return batches.data;
  });
};

export const FetchCells = async (batch: number) => {
  const url = new URL(`${base}/warehouse/cells`);

  return await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      batch: batch,
    }),
  }).then(async (response) => {
    const cells: { data: Array<CellT> } = await response.json();
    return cells.data;
  });
};

export const FetchTimeseries = async () => {};
