/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const githubPagesPath = '/tyco-presales'

const nextConfig = {
  output: 'export',
  trailingSlash: false,
  basePath: isGithubActions ? githubPagesPath : '',
  assetPrefix: isGithubActions ? githubPagesPath : undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
