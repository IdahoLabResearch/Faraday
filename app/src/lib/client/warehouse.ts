// Environment
const base = import.meta.env.VITE_DJANGO_PROXY;

// Types
import { CategoryT, TypeT, BatchT, CellT } from "../types/warehouse";

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
