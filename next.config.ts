import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "three", "@react-three/fiber", "@react-three/drei"],
  },
};

export default nextConfig;
