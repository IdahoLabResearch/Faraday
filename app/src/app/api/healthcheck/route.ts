// Types
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json("Faraday is running");
};
