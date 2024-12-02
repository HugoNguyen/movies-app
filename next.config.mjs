/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    headers: [
        {
            key: 'ngrok-skip-browser-warning',
            value: 'skip',
        },
    ],
    async redirects() {
        return [
            {
                source: '/',
                destination: '/movies',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
