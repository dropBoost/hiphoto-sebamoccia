// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "irlwocjarshrmesodbxc.supabase.co",
      },
    ],
  },
}

export default nextConfig
