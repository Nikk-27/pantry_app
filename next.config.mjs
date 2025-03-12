/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
<<<<<<< HEAD
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
=======
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
>>>>>>> d4437d5048ea7343977755fa469d6cb92a96b109
};

export default nextConfig;
