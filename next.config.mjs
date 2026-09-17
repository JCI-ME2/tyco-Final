/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  output: 'export',
  trailingSlash: false,
  basePath: isGithubActions ? '/tyco-presales' : '',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
