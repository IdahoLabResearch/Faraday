const base = import.meta.env.VITE_DEEPLYNX_BASE;
const key = import.meta.env.DEEPLYNX_KEY!;
const secret = import.meta.env.DEEPLYNX_SECRET!;
const expiry = import.meta.env.DEEPLYNX_EXPIRY!;
const container = import.meta.env.DEEPLYNX_CONTAINER;

// Lodash
import { uniqBy } from "lodash";

// HTTP
import axios from "axios";

// Encryption
// import { decrypt } from "@/lib/ecryption";

// Types
import { NodeResponseT } from "@/lib/types/graphql";

export const FetchToken = async () => {
  const token = await axios
    .get(`${base}/oauth/token`, {
      headers: {
        "x-api-key": key,
        "x-api-secret": secret,
        "x-api-expiry": expiry,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    });

  return token;
};

export const FetchCategories = async (
  code: string,
  encrypted_token: string
) => {
  const url = new URL(`${base}/containers/${container}/data`);

  const dataSources = decrypt(code);
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  const data = {
    query: `{
          nodes(
            data_source_id: {
              operator: "in"
              value: ${dataSources}
            }
            metatype_name: {
              operator: "in"
              value: [
                "Performance Test"
                "Degradation Test"
                "Characterization Test"
                "Durability Test"
              ]
            }
          ) {
              id 
              metatype_name
          }
        }`,
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const graph: NodeResponseT = await response.json();
    return graph.data["nodes"];
  });
};

export const FetchGraph = async (rootId: string, encrypted_token: string) => {
  const url = new URL(`${base}/containers/${container}/data`);
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  const data = {
    query: `{
              graph(root_node: "${rootId}", depth: "1") {
                destination_id
                destination_metatype_name
              }
            }`,
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify(data),
  }).then(async (response) => {
    const graph = await response.json();
    const data: Array<{ id: string; class: string }> = graph.data.graph.map(
      (node: { destination_id: string; destination_metatype_name: string }) => {
        return {
          id: node.destination_id,
          class: node.destination_metatype_name,
        };
      }
    );
    return data;
  });
};

export const FetchNodes = async (encrypted_token: string) => {
  const url = new URL(`${base}/containers/${container}/graphs/nodes`);
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  return await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  }).then(async (response) => {
    const data = await response.json();
    return data.value;
  });
};

export const FetchBatches = async (
  nodeId: string,
  type: string,
  encrypted_token: string
) => {
  let batches;
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  if (type === "Pulse Width Modulation Accelerated Stress Test") {
    batches = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Pulse_Width_Modulation_Accelerated_Stress_Test {
            cell_batch
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data =
          payload.data["Pulse_Width_Modulation_Accelerated_Stress_Test"];
        const batches = uniqBy(data, "cell_batch"); // Return only unique instances of cell batches
        return batches;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (type === "Impedance Test") {
    batches = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Impedance_Test {
            cell_batch
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data = payload.data["Impedance_Test"];
        const batches = uniqBy(data, "cell_batch"); // Return only unique instances of cell batches
        return batches;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (type === "Potentiostatic Test") {
    batches = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Potentiostatic_Test {
            cell_batch
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data = payload.data["Potentiostatic_Test"];
        const batches = uniqBy(data, "cell_batch"); // Return only unique instances of cell batches
        return batches;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  return batches;
};

export const FetchCells = async (
  nodeId: string,
  type: string,
  batch: string,
  encrypted_token: string
) => {
  let cells;
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  if (type === "Impedance Test" && type && batch) {
    cells = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Impedance_Test(cell_batch: { operator: "eq", value: "${batch}" }) {
            cell
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data = payload.data["Impedance_Test"];
        const cells = uniqBy(data, "cell"); // Return only unique instances of cell batches
        return cells;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (type === "Potentiostatic Test" && type && batch) {
    cells = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Potentiostatic_Test(cell_batch: { operator: "eq", value: "${batch}" }) {
            cell
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data = payload.data["Potentiostatic_Test"];
        const cells = uniqBy(data, "cell"); // Return only unique instances of cell batches
        return cells;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (
    type === "Pulse Width Modulation Accelerated Stress Test" &&
    type &&
    batch
  ) {
    cells = await fetch(
      `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          query: `{
          Pulse_Width_Modulation_Accelerated_Stress_Test(cell_batch: { operator: "eq", value: "${batch}" }) {
            cell
          }
        }`,
        }),
      }
    )
      .then(async (response) => {
        const payload = await response.json();
        const data =
          payload.data["Pulse_Width_Modulation_Accelerated_Stress_Test"];
        const cells = uniqBy(data, "cell"); // Return only unique instances of cell batches
        return cells;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  return cells;
};

export const FetchTimeseries = async (
  nodeId: string,
  cell: string,
  batch: string,
  type: string,
  encrypted_token: string
) => {
  let data;
  const token = decrypt(encrypted_token).replace(/['"]/g, "");

  if (type === "Pulse Width Modulation Accelerated Stress Test") {
    data = await axios
      .post(
        `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
        {
          query: `{
              Pulse_Width_Modulation_Accelerated_Stress_Test(cell: { operator: "eq", value: "${cell}" }, cell_batch: { operator: "eq", value: "${batch}" }) {
                  time
                  current_density
              }
          }`,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data.data[
          "Pulse_Width_Modulation_Accelerated_Stress_Test"
        ];
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (type === "Impedance Test") {
    data = await axios
      .post(
        `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
        {
          query: `{
                Impedance_Test(cell: { operator: "eq", value: "${cell}" }, cell_batch: { operator: "eq", value: "${batch}" }) {
                    time
                    frequency
                    real_impedance
                    imaginary_impedance
                }
            }`,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data.data["Impedance_Test"];
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  if (type === "Potentiostatic Test") {
    data = await axios
      .post(
        `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
        {
          query: `{
                Potentiostatic_Test(cell: { operator: "eq", value: "${cell}" }, cell_batch: { operator: "eq", value: "${batch}" }) {
                    time
                    current_density
                    voltage
                }
            }`,
        },
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      )
      .then((response) => {
        return response.data.data["Potentiostatic_Test"];
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  return data;
};
