/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/api/:path*",
            destination: "https://dar-el-mecca.vercel.app/pages/apis/:path*",
          },
        ];
      },
};

export default nextConfig;


