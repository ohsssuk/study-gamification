/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const productionPath = "/study-gamification";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
  },
  basePath: productionPath,
  assetPrefix: productionPath,
};

export default nextConfig;
