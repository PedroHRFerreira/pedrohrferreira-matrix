import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  outputFileTracingRoot: process.cwd(),
  experimental: {
    useTypeScriptCli: false
  }
}

export default nextConfig
