// PM2 process file for a VPS (Hostinger VPS, Oracle Cloud, etc.)
// Usage (from the project root, after building both apps):
//   pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup
module.exports = {
  apps: [
    {
      name: "craft-backend",
      // `medusa build` puts the production server in .medusa/server
      cwd: "./apps/backend/.medusa/server",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production", PORT: 9000 },
      max_memory_restart: "1500M",
    },
    {
      name: "craft-storefront",
      cwd: "./apps/storefront",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production", PORT: 8000 },
      max_memory_restart: "800M",
    },
  ],
}
