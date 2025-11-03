import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(__dirname);

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@fullstack-demo/design-system"],
  env: {
    BACKEND_ORIGIN: process.env.BACKEND_ORIGIN ?? "",
  },
};

export default nextConfig;
