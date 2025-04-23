const server = import.meta.env.VITE_DJANGO_PROXY!;

// Types
import { ImpedanceDataT } from "../types/timeseries";
import { PotentiostaticDataT } from "../types/timeseries";

export const FetchDRT = async (
  data: Array<ImpedanceDataT>,
  sweeps: Array<number>
) => {
  try {
    const response = await fetch(`${server}/timeseries/pydrt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data, sweeps }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const drt = await response.json();
    return drt;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const SigmoidRegression = async (
  name: string,
  timeseries: Array<PotentiostaticDataT>
) => {
  try {
    const response = await fetch(`${server}/timeseries/sigmoid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        timeseries: timeseries,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("Error: " + error);
    return error;
  }
};

export const LinearRegression = async (data: Array<PotentiostaticDataT>) => {
  try {
    const response = await fetch(`${server}/timeseries/linear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data;
  } catch (error) {
    console.log("Error: " + error);
    return error as Error;
  }
};
