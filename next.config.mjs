/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProduction ? "/study-gamification" : "",
  assetPrefix: isProduction
    ? "https://ohsssuk.github.io/study-gamification"
    : "",
};

export default nextConfig;
