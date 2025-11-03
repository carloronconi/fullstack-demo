import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/design-system/src/**/*.{ts,tsx}",
    "../../packages/design-system/dist/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
};

export default config;
