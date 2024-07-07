/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    experimental: { outputFileTracingIncludes: { "/": ["./node_modules/argon2/prebuilds/linux-arm64/*.musl.*", "./node_modules/argon2/prebuilds/linux-x64/*.musl.*"], }, },
};

export default nextConfig;
