import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Node database/SMTP drivers retain their native module loading.
  serverExternalPackages: ["mysql2", "nodemailer"]
};
export default nextConfig;
