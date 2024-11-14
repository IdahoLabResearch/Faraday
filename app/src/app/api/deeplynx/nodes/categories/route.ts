// Axois
import axios from "axios";

// Agent
import { agent } from "@/app/api/agent";

// Types
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { NodeResponseT } from "@/lib/types/graphql";

const base = process.env.DEEPLYNX_BASE!;
const container = process.env.DEEPLYNX_CONTAINER!;

export const GET = async (req: NextRequest, res: NextResponse) => {
  let nodes: Array<NodeResponseT> = await axios
    .post(
      `${base}/containers/${container}/data`,
      {
        query: `{
          nodes(
            metatype_name: {
              operator: "in"
              value: [
                "Performance Test"
                "Degredation Test"
                "Characterization Test"
                "Durability Test"
              ]
            }
          ) {
              id 
              original_id
              metatype_id
              metatype_name
              properties
              data_source_id
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
      const payload = response.data;
      const data: Array<NodeResponseT> = payload.data.nodes;
      return data;
    })
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    });

  return NextResponse.json(nodes);
};
