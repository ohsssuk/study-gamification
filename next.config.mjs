/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? "/study-gamification" : "";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
  },
  basePath: isProduction ? basePath : "",
  assetPrefix: isProduction ? `${basePath}/` : "",
  webpack(config) {
    if (isProduction) {
      config.output.publicPath = `${basePath}/`;
    }

    return config;
  },
};

export default nextConfig;
