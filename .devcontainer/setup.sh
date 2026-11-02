#!/usr/bin/env bash
# Runs once when the codespace is created: installs packages, creates the
# database tables, loads the sample store and creates an admin login.
set -e
cd "$(dirname "$0")/.."
source .devcontainer/urls.sh

ADMIN_EMAIL="admin@craftstore.local"
ADMIN_PASSWORD="craftstore123"

echo "==> Waiting for the database…"
until (echo > /dev/tcp/localhost/5432) 2>/dev/null; do sleep 1; done
sleep 2

echo "==> Backend: installing packages (a few minutes)…"
write_backend_env
cd apps/backend
npm install --no-audit --no-fund

echo "==> Backend: creating tables and sample store…"
npm run setup 2>&1 | tee ../../.devcontainer/setup.log

echo "==> Creating admin login…"
npx medusa user -e "$ADMIN_EMAIL" -p "$ADMIN_PASSWORD" || echo "(admin user may already exist)"
cd ../..

# Read the storefront key from the database (works on re-runs too)
KEY=$(node -e '
const { Client } = require("./apps/backend/node_modules/pg");
const c = new Client({ connectionString: "postgres://postgres:postgres@localhost:5432/craftstore" });
c.connect()
  .then(() => c.query("select token from api_key where type = $1 and deleted_at is null order by created_at limit 1", ["publishable"]))
  .then(r => { console.log(r.rows[0]?.token ?? ""); return c.end() })
  .catch(() => console.log(""))
' 2>/dev/null || true)
if [ -z "$KEY" ]; then
  KEY=$(grep -o "pk_[A-Za-z0-9]*" .devcontainer/setup.log | tail -1 || true)
fi
echo "$KEY" > .devcontainer/publishable-key.txt

echo "==> Storefront: installing packages…"
write_storefront_env "$KEY"
cd apps/storefront
npm install --no-audit --no-fund --legacy-peer-deps
cd ../..

cat <<EOF

=============================================================
 Setup finished.
 Admin login:  $ADMIN_EMAIL  /  $ADMIN_PASSWORD
 (change it later in the admin under Settings → Profile)
=============================================================
EOF
