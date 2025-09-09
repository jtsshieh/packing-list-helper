import { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	outputFileTracingIncludes: {
		'/': [
			'./node_modules/argon2/prebuilds/linux-arm64/*.musl.*',
			'./node_modules/argon2/prebuilds/linux-x64/*.musl.*',
		],
	},
	experimental: {
		typedRoutes: true,
	},
};

export default nextConfig;
