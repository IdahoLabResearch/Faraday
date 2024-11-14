// Next
export const dynamic = "force-dynamic";

// Axios
import axios from "axios";

// Agent
import { agent } from "@/app/api/agent";

// Types
import { NextResponse } from "next/server";

const base = process.env.DEEPLYNX_BASE!;
const key = process.env.DEEPLYNX_KEY!;
const secret = process.env.DEEPLYNX_SECRET!;
const expiry = process.env.DEEPLYNX_EXPIRY!;

export const GET = async () => {
  console.log("Calling: " + `${base}/oauth/token`);

  let token = await axios
    .get(`${base}/oauth/token`, {
      headers: {
        "x-api-key": key,
        "x-api-secret": secret,
        "x-api-expiry": expiry,
      },
      httpsAgent: agent,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("Error: " + error);
      return error;
    });

  return NextResponse.json(token);
};
