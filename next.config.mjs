/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5000/api/:path*" // Local dev
            : "https://pantry-app-nikita-lalwanis-projects.vercel.app/api/:path*", // Vercel API path
      },
    ];
  },
};

export default nextConfig;
