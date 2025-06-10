import { NextConfig } from 'next'

const nextConfig: NextConfig = {
// Permitir HMR y carga de recursos de /_next/* desde IPs de desarrollo
allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '172.16.5.6:3000'],

// Otras configuraciones globales de Next.js
reactStrictMode: true,
experimental: {
// Si usas nuevas características experimentales, decláralas aquí
}
}

export default nextConfig