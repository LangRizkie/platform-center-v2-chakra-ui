import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	assetPrefix: '/platform-static',
	experimental: {
		optimizePackageImports: ['@chakra-ui/react']
	},
	reactStrictMode: false,
	rewrites: async () => ({
		beforeFiles: [
			{
				destination: '/_next/:path+',
				source: '/platform-static/_next/:path+'
			}
		]
	})
}

export default nextConfig
