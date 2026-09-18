/** @type {import('next').NextConfig} */
const isProductionBuild = process.env.NODE_ENV === 'production'
const githubPagesPath = '/tyco-presales'

const nextConfig = {
  output: 'export',
  trailingSlash: false,
  basePath: isProductionBuild ? githubPagesPath : '',
  assetPrefix: isProductionBuild ? githubPagesPath : undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
