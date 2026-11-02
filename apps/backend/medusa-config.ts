import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const REDIS_URL = process.env.REDIS_URL
// Set USE_REDIS_MODULES=true on a VPS / production server. Leave it unset for
// local development and on Medusa Cloud (Cloud configures these itself).
const useRedis = process.env.USE_REDIS_MODULES === "true" && !!REDIS_URL

const razorpayEnabled =
  !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET

const modules: any[] = [
  // Banners, homepage sections and site settings (edited in Admin → Storefront)
  { resolve: "./src/modules/store-content" },
]

// Public address for uploaded images when they're stored on this server
// (set automatically in Codespaces; on a VPS set it to https://api.yourstore.in/static).
if (process.env.FILE_PUBLIC_URL) {
  modules.push({
    resolve: "@medusajs/medusa/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/file-local",
          id: "local",
          options: {
            upload_dir: "static",
            backend_url: process.env.FILE_PUBLIC_URL,
          },
        },
      ],
    },
  })
}

if (razorpayEnabled) {
  modules.push({
    resolve: "@medusajs/medusa/payment",
    options: {
      providers: [
        {
          resolve: "./src/modules/razorpay",
          id: "razorpay",
          options: {
            keyId: process.env.RAZORPAY_KEY_ID,
            keySecret: process.env.RAZORPAY_KEY_SECRET,
            webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
          },
        },
      ],
    },
  })
}

if (useRedis) {
  modules.push(
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: { redisUrl: REDIS_URL },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: { redis: { url: REDIS_URL } },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: { redisUrl: REDIS_URL },
          },
        ],
      },
    }
  )
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: useRedis ? REDIS_URL : undefined,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    // Set to "true" if you host the admin separately (rare).
    disable: process.env.DISABLE_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  modules,
})
