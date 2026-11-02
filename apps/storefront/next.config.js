const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * Product and banner images are served by your Medusa backend (or a file
 * storage service). Allow those hosts for Next.js image optimisation.
 * Add extra hosts as a comma-separated list in IMAGE_HOSTS.
 */
const hostOf = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}
const extraImageHosts = [
  hostOf(process.env.MEDUSA_BACKEND_URL || ""),
  ...(process.env.IMAGE_HOSTS || "").split(",").map((h) => h.trim()),
].filter(Boolean)

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      ...extraImageHosts.flatMap((hostname) => [
        { protocol: "https", hostname },
        { protocol: "http", hostname },
      ]),
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
