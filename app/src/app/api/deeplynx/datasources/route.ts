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
  let containers = await axios
    .get(`${base}/containers/${container}/import/datasources`, {
      headers: {
        Authorization: headers().get("Authorization"),
      },
      httpsAgent: agent,
    })
    .then((response) => {
      return response.data.value;
    })
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    });

  return NextResponse.json(containers);
};
