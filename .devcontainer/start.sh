#!/usr/bin/env bash
# Starts the backend (port 9000) and the storefront (port 8000).
# Runs automatically when you open the codespace. Run it again any time with:
#   bash .devcontainer/start.sh
cd "$(dirname "$0")/.."
source .devcontainer/urls.sh

port_open() { (echo > /dev/tcp/localhost/$1) 2>/dev/null; }

if port_open 8000 && port_open 9000; then
  echo "The store is already running."
  echo "  Store: ${STORE_PUBLIC}"
  echo "  Admin: ${BACKEND_PUBLIC}/app"
  exit 0
fi

if [ ! -d apps/backend/node_modules ] || [ ! -d apps/storefront/node_modules ]; then
  echo "Setup hasn't finished yet. Wait for it, then run: bash .devcontainer/start.sh"
  exit 0
fi

# URLs can change if the codespace is renamed, so refresh the .env files.
write_backend_env
write_storefront_env "$(cat .devcontainer/publishable-key.txt 2>/dev/null)"

# Make the backend URL public so product images load on the store.
if [ -n "$CODESPACE_NAME" ] && command -v gh >/dev/null; then
  gh codespace ports visibility 9000:public -c "$CODESPACE_NAME" >/dev/null 2>&1 || true
fi

if ! port_open 9000; then
  echo "==> Starting backend (logs: .devcontainer/backend.log)…"
  (cd apps/backend && nohup npm run dev > ../../.devcontainer/backend.log 2>&1 &)
  for i in $(seq 1 180); do port_open 9000 && break; sleep 2; done
fi

if ! port_open 8000; then
  echo "==> Starting store (logs: .devcontainer/storefront.log)…"
  (cd apps/storefront && nohup npm run dev > ../../.devcontainer/storefront.log 2>&1 &)
  for i in $(seq 1 90); do port_open 8000 && break; sleep 2; done
fi

cat <<EOF

=============================================================
 Your store is running.

 Store:  ${STORE_PUBLIC}
 Admin:  ${BACKEND_PUBLIC}/app
         login: admin@craftstore.local / craftstore123

 The first page load can take ~30 seconds while it compiles.
 Problems? Look at .devcontainer/backend.log and storefront.log
=============================================================
EOF
