import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@fullstack-demo/design-system"],
};

export default nextConfig;
