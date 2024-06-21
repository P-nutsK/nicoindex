//@ts-check
/** @satisfies {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: true,
		swcPlugins: [["@swc-jotai/react-refresh", {}]],
	},
};

export default nextConfig;
