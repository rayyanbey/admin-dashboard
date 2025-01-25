/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: "/api/:path*",
            destination: "http://localhost:3000/pages/apis/:path*",
          },
        ];
      },
};

export default nextConfig;


