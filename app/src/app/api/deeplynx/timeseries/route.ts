// Axois
import axios from "axios";

// Agent
import { agent } from "@/app/api/agent";

// Types
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

const base = process.env.DEEPLYNX_BASE!;
const container = process.env.DEEPLYNX_CONTAINER!;

export const GET = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId");
  const cellId = searchParams.get("cellId");
  const cellBatch = searchParams.get("cellBatch");
  const type = searchParams.get("type");

  let data;

  if (type === "Pulse Width Modulation Accelerated Stress Test") {
    data = await axios
      .post(
        `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
        {
          query: `{
                Pulse_Width_Modulation_Accelerated_Stress_Test(cell: { operator: "eq", value: "${cellId}" }, cell_batch: { operator: "eq", value: "${cellBatch}" }) {
                    time
                    current_density
                }
            }`,
        },
        {
          headers: {
            Authorization: headers().get("Authorization"),
          },
          httpsAgent: agent,
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
                Impedance_Test(cell: { operator: "eq", value: "${cellId}" }, cell_batch: { operator: "eq", value: "${cellBatch}" }) {
                    time
                    real_impedance
                    imaginary_impedance
                }
            }`,
        },
        {
          headers: {
            Authorization: headers().get("Authorization"),
          },
          httpsAgent: agent,
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
                Potentiostatic_Test(cell: { operator: "eq", value: "${cellId}" }, cell_batch: { operator: "eq", value: "${cellBatch}" }) {
                    time
                    current_density
                    voltage
                }
            }`,
        },
        {
          headers: {
            Authorization: headers().get("Authorization"),
          },
          httpsAgent: agent,
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

  return NextResponse.json(data);
};
