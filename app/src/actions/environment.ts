"use server";

interface Environment {
  DEEPLYNX_BASE: string | undefined;
  DEEPLYNX_CONTAINER: string | undefined;
  DEEPLYNX_KEY: string | undefined;
  DEEPLYNX_SECRET: string | undefined;
  DEEPLYNX_EXPIRY: string | undefined;
}

export default async function Environment(): Promise<Environment> {
  "use server";

  return {
    DEEPLYNX_BASE: process.env.DEEPLYNX_BASE,
    DEEPLYNX_CONTAINER: process.env.DEEPLYNX_CONTAINER,
    DEEPLYNX_KEY: process.env.DEEPLYNX_KEY,
    DEEPLYNX_SECRET: process.env.DEEPLYNX_SECRET,
    DEEPLYNX_EXPIRY: process.env.DEEPLYNX_EXPIRY,
  };
}
