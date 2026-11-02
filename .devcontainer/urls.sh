# Works out the public URLs of this codespace and writes both .env files.
# Sourced by setup.sh and start.sh.

if [ -n "$CODESPACE_NAME" ]; then
  DOMAIN="${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-app.github.dev}"
  BACKEND_PUBLIC="https://${CODESPACE_NAME}-9000.${DOMAIN}"
  STORE_PUBLIC="https://${CODESPACE_NAME}-8000.${DOMAIN}"
else
  BACKEND_PUBLIC="http://localhost:9000"
  STORE_PUBLIC="http://localhost:8000"
fi
BACKEND_HOST="${BACKEND_PUBLIC#https://}"
BACKEND_HOST="${BACKEND_HOST#http://}"

write_backend_env() {
  cat > apps/backend/.env <<EOF
DATABASE_URL=postgres://postgres:postgres@localhost:5432/craftstore
REDIS_URL=redis://localhost:6379
USE_REDIS_MODULES=false
JWT_SECRET=codespace-dev-secret
COOKIE_SECRET=codespace-dev-secret
STORE_CORS=http://localhost:8000,${STORE_PUBLIC}
ADMIN_CORS=http://localhost:9000,http://localhost:5173,${BACKEND_PUBLIC}
AUTH_CORS=http://localhost:9000,http://localhost:5173,http://localhost:8000,${BACKEND_PUBLIC},${STORE_PUBLIC}
MEDUSA_BACKEND_URL=${BACKEND_PUBLIC}
FILE_PUBLIC_URL=${BACKEND_PUBLIC}/static
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-}
RAZORPAY_WEBHOOK_SECRET=${RAZORPAY_WEBHOOK_SECRET:-}
EOF
}

write_storefront_env() {
  local key="$1"
  cat > apps/storefront/.env.local <<EOF
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${key}
NEXT_PUBLIC_BASE_URL=${STORE_PUBLIC}
NEXT_PUBLIC_DEFAULT_REGION=in
NEXT_PUBLIC_STORE_NAME=MemoryMakers4U
REVALIDATE_SECRET=codespace-dev-secret
IMAGE_HOSTS=${BACKEND_HOST}
EOF
}
