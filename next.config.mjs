/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const productionURL = "https://ohsssuk.github.io";
const productionPath = "/study-gamification";

const nextConfig = {
  output: "export",
  basePath: isProduction ? productionURL : "",
  assetPrefix: isProduction ? productionPath : "",
};

export default nextConfig;
