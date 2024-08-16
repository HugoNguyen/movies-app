/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    headers: [
        {
            key: 'ngrok-skip-browser-warning',
            value: 'skip',
        },
    ],
};

export default nextConfig;
