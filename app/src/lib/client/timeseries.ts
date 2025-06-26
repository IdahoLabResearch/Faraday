const server = import.meta.env.VITE_DJANGO_PROXY!;

// Types
import {
  ElectrolysisCellQuery,
  ElectrolysisStackQuery,
} from "../types/timeseries";

export const FetchCellData = async (query: ElectrolysisCellQuery) => {
  try {
    const response = await fetch(`${server}/timeseries/cells`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: query.provider,
        test: query.test,
        cell: query.cell,
        batch: query.batch,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const FetchStackData = async (query: ElectrolysisStackQuery) => {
  try {
    const response = await fetch(`${server}/timeseries/stacks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: query.provider,
        test: query.test,
        stackid: query.stackid,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};
