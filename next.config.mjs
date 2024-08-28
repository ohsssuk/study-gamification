/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
  },
  basePath: isProduction ? "/study-gamification" : "",
  assetPrefix: isProduction ? "/study-gamification/" : "",
};

export default nextConfig;
