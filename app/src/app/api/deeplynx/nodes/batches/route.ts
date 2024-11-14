// Axois
import axios from "axios";

// Agent
import { agent } from "@/app/api/agent";

// Types
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Lodash
import uniqBy from "lodash/uniqBy";

const base = process.env.DEEPLYNX_BASE!;
const container = process.env.DEEPLYNX_CONTAINER!;

export const GET = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url);
  const nodeId = searchParams.get("nodeId");
  const type = searchParams.get("type");

  let data;

  if (type === "Pulse Width Modulation Accelerated Stress Test") {
    data = await axios
      .post(
        `${base}/containers/${container}/graphs/nodes/${nodeId}/timeseries`,
        {
          query: `{
                  Pulse_Width_Modulation_Accelerated_Stress_Test {
                      cell_batch
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
        const payload =
          response.data.data["Pulse_Width_Modulation_Accelerated_Stress_Test"];
        const batches = uniqBy(payload, "cell_batch"); // Return only unique instances of cell batches
        return batches;
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
                Impedance_Test{
                    cell_batch
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
        const payload = response.data.data["Impedance_Test"];
        const batches = uniqBy(payload, "cell_batch"); // Return only unique instances of cell batches
        return batches;
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
                  Potentiostatic_Test {
                      cell_batch
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
        const payload = response.data.data["Potentiostatic_Test"];
        const batches = uniqBy(payload, "cell_batch"); // Return only unique instances of cell batches
        return batches;
      })
      .catch((error) => {
        console.log("Error: " + error);
        return error;
      });
  }

  return NextResponse.json(data);
};
