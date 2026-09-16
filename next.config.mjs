/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  ...(process.env.NODE_ENV === 'production' && { output: 'export' }),

  trailingSlash: true,
  basePath: isGithubActions ? '/tyco-Final' : '',
  assetPrefix: isGithubActions ? '/tyco-Final/' : undefined,

  images: {
    unoptimized: true,
  },
}

export default nextConfig
