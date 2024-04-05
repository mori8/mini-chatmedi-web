/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: `/api/:path*`,
      },
      {
        source: "/fastapi/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
