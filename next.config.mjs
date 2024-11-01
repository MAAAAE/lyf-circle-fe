const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
      {
        source: "/ws-chat/:path*",
        destination: "http://localhost:8080/api/ws-chat/:path*",
      },
    ];
  },
  images: {
    domains: ["hebbkx1anhila5yf.public.blob.vercel-storage.com"],
  },
};

export default nextConfig;
