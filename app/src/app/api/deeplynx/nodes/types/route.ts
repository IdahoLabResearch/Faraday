// Axois
import axios from "axios";

// Agent
import { agent } from "@/app/api/agent";

// Types
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { EdgeResponseT } from "@/lib/types/graphql";

const base = process.env.DEEPLYNX_BASE!;
const container = process.env.DEEPLYNX_CONTAINER!;

export const GET = async (req: NextRequest, res: NextResponse) => {
  const { searchParams } = new URL(req.url);
  const originID = searchParams.get("originID");

  let edges: Array<EdgeResponseT> = await axios
    .post(
      `${base}/containers/${container}/data`,
      {
        query: `{
          graph(root_node: "${originID}", depth: "1") {
            origin_id
            origin_metatype_name
            relationship_name
            destination_id
            destination_metatype_name
            edge_direction
          }
        }
      `,
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
      const data = payload.data.graph.filter((edge: EdgeResponseT) => {
        return edge.relationship_name === "occurredBy";
      });
      return data;
    })
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    });

  return NextResponse.json(edges);
};
