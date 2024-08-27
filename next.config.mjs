/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const productionPath = "/study-gamification";
const productionURL = "https://ohsssuk.github.io/study-gamification/";

const nextConfig = {
  output: "export",
  images: {
    unoptimized: true, // 이미지 최적화 비활성화
    loader: "custom",
    loaderFile: "./ImageLoader.ts",
  },
};

export default nextConfig;
