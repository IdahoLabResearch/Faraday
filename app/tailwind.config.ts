import type { Config } from "tailwindcss";

// Plugins
import daisyui from "daisyui";
import typographyPlugin from "@tailwindcss/typography";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [typographyPlugin, daisyui],
} satisfies Config;
