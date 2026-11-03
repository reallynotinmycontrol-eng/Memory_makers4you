# Craft Store – Medusa + Next.js

An online store for jewellery-making and craft supplies.

- **apps/backend** – Medusa v2.18 backend and **admin panel** (products, categories, orders, customers, discounts, plus a custom **Storefront** page for banners, homepage sections and site settings). Includes a **Razorpay** payment provider.
- **apps/storefront** – Next.js storefront. Everything on it comes from the admin: menu, homepage, products, prices, stock, banners, announcement bar, contact details.

Prices are in **INR**, entered **inclusive of GST**. The seed creates an India region, two shipping options (Standard ₹70, Express ₹150), the 39 categories and 117 items from the MemoryMakers4U Excel price list, exactly as listed there (`apps/backend/src/scripts/catalog.ts`; the 3 items with no price are saved as hidden drafts) with no photos (the store shows a placeholder until you upload your own).

---

## Quickest way to try it: GitHub Codespaces (nothing to install)

1. Open this repository on GitHub.
2. Click the green **Code** button → **Codespaces** tab → **Create codespace on main**.
3. Wait 5–10 minutes the first time. A terminal shows the progress; it installs everything, creates the database and loads the sample store.
4. When it prints **"Your store is running"**, open the two links it shows:
   - **Store** (port 8000)
   - **Admin** (port 9000, add `/app`) – login `admin@craftstore.local` / `craftstore123`

You can also find both links in the **Ports** tab at the bottom of the screen.

- If the store isn't running after you come back later, open a terminal (**Ctrl + `**) and run `bash .devcontainer/start.sh`.
- Stop the codespace when you're done (github.com/codespaces → … → **Stop codespace**) to save your free monthly hours.
- To try Razorpay here, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` as Codespaces secrets in your GitHub settings, then rebuild the codespace.

---

## 1. Run it on your computer

### You need

- **Node.js 20 or newer** – https://nodejs.org (LTS)
- **PostgreSQL 15 or newer** – https://www.postgresql.org/download/
  On Windows the installer asks for a password for the `postgres` user; remember it.
- **Git** (optional)

Redis is **not** needed for local development.

### Step 1 – Create the database

Open a terminal (on Windows: "SQL Shell (psql)") and run:

```sql
CREATE DATABASE craftstore;
```

### Step 2 – Configure the backend

```bash
cd apps/backend
cp .env.template .env        # Windows: copy .env.template .env
```

Open `apps/backend/.env` and set `DATABASE_URL` with your Postgres password:

```
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/craftstore
```

Leave the Razorpay keys empty for now (a "manual" test payment is used instead).

### Step 3 – Install, create tables and add sample data

```bash
cd apps/backend
npm install
npm run setup
```

`npm run setup` creates the database tables (including the storefront content tables) and loads the sample store. **At the end it prints a line like this – copy it, you need it in step 5:**

```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01H...
```

> Run `npm run setup` only once. To start again from scratch, drop and re-create the database first.

### Step 4 – Create your admin login and start the backend

```bash
npx medusa user -e you@example.com -p a-strong-password
npm run dev
```

Admin panel: **http://localhost:9000/app**

### Step 5 – Configure and start the storefront

In a **second** terminal:

```bash
cd apps/storefront
cp .env.template .env.local       # Windows: copy .env.template .env.local
```

Paste the publishable key from step 3 into `.env.local`:

```
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_01H...
```

Then:

```bash
npm install
npm run dev
```

Store: **http://localhost:8000** (it redirects to `/in`).

---

## 2. Managing the store (admin panel)

| What you want to change | Where |
|---|---|
| Products, photos, prices, stock, variants (colour, size…) | **Products** |
| Menu / categories (order, names, sub-categories) | **Products → Categories** (drag to reorder) |
| Category tile photo | Categories → edit category → **Metadata** → key `image_url`, value = image link. Without it, a product photo from that category is used. |
| Product groups (e.g. "Best Sellers") | **Products → Collections** – create one, add products, then add a homepage row for it in **Storefront** |
| Homepage banners (slider + promo tiles) | **Storefront → Banners** |
| Homepage sections and their order | **Storefront → Homepage sections** |
| Announcement bar, logo, store name, phone, WhatsApp, address, social links, footer text, shipping note | **Storefront → Settings** |
| Shipping prices | **Settings → Locations & Shipping** |
| Discount codes | **Promotions** |
| Orders, refunds, fulfilment | **Orders** |

Storefront changes appear within about a minute.

---

## 3. Razorpay payments

1. Sign up at https://dashboard.razorpay.com and open **Account & Settings → API Keys**. Generate **test** keys first.
2. Put them in `apps/backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
3. Restart the backend.
4. Admin → **Settings → Regions → India** → edit → **Payment providers** → tick **razorpay**. (If the keys were already set when you ran `npm run setup`, this is done for you.)
5. Untick **system default (manual)** before going live – it's for testing only and lets orders through without payment.
6. Recommended: add a webhook in Razorpay (**Settings → Webhooks**) pointing to
   `https://YOUR-BACKEND-DOMAIN/hooks/payment/razorpay_razorpay`
   with events `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid`. Set a secret and put it in `RAZORPAY_WEBHOOK_SECRET`. This keeps orders correct if a customer closes the browser right after paying.
7. When you're ready to take real money, complete Razorpay's KYC and swap in the **live** keys.

How it works: the backend creates a Razorpay order, the storefront opens Razorpay Checkout (UPI, cards, net banking, wallets), and before creating the Medusa order the backend asks Razorpay directly whether the payment succeeded – so a payment can't be faked from the browser.

---

## 4. Going live

The code works with any of these. Pick one.

### Option A – Oracle Cloud Always Free or a Hostinger VPS (Ubuntu)

Rough steps (2 GB RAM minimum, 4 GB+ recommended):

```bash
# On the server
sudo apt update && sudo apt install -y nginx postgresql redis-server certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pm2

sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'CHOOSE_A_PASSWORD';"
sudo -u postgres psql -c "CREATE DATABASE craftstore;"

git clone <your repo> craft-store && cd craft-store
```

Backend (`apps/backend/.env`): set `DATABASE_URL`, `USE_REDIS_MODULES=true`, long random `JWT_SECRET` and `COOKIE_SECRET`, `MEDUSA_BACKEND_URL=https://api.yourstore.in`, `STORE_CORS=https://yourstore.in`, `ADMIN_CORS=https://api.yourstore.in`, `AUTH_CORS=https://api.yourstore.in,https://yourstore.in`, and your Razorpay keys. Then:

```bash
cd apps/backend
npm install
npm run setup                       # first time only
npx medusa user -e you@example.com -p a-strong-password
npm run build
cd .medusa/server && npm install --omit=dev && cp ../../.env .env && cd ../../../..
```

Storefront (`apps/storefront/.env.local`): `MEDUSA_BACKEND_URL=https://api.yourstore.in`, `NEXT_PUBLIC_BASE_URL=https://yourstore.in`, your publishable key. Then:

```bash
cd apps/storefront && npm install && npm run build && cd ../..
pm2 start deploy/ecosystem.config.js && pm2 save && pm2 startup
```

Point your domain's DNS (`yourstore.in`, `www`, `api`) to the server's IP, then use `deploy/nginx.conf` and run certbot as described inside that file.

**Product photos on a VPS** are stored on the server's disk by default. That's fine to start with; for backups and speed, later switch to S3-compatible storage (e.g. Cloudflare R2) using Medusa's S3 file provider.

### Option B – Medusa Cloud

1. Push this folder to a GitHub repository.
2. In Medusa Cloud, create a project from that repo. The backend is in `apps/backend` and the storefront in `apps/storefront`; follow Medusa Cloud's monorepo/storefront guide (https://docs.medusajs.com/cloud/storefront) to point it at these folders.
3. Add the Razorpay variables in the Cloud environment settings. Leave `USE_REDIS_MODULES` unset – Cloud configures Redis itself.
4. Run the seed once from the Cloud CLI or dashboard, and create your admin user.

---

## 5. Changing the look

- Colours: `apps/storefront/tailwind.config.js` → `peacock`, `kumkum`, `zari`, `blush`, `ink`.
- Fonts: `apps/storefront/src/app/layout.tsx` (Marcellus for headings, Mulish for text).
- Header / menu: `src/modules/layout/templates/nav`, `src/modules/layout/components/mega-menu`.
- Homepage: `src/app/[countryCode]/(main)/page.tsx` and `src/modules/home/components`.
- Product card: `src/modules/products/components/product-preview`.

---

## 6. Troubleshooting

| Problem | Fix |
|---|---|
| `npm run setup` says it can't connect to the database | Check `DATABASE_URL` (password, port 5432) and that PostgreSQL is running. |
| Storefront shows "No valid regions configured" | The seed didn't run, or the publishable key in `.env.local` is wrong. |
| Storefront error "Missing required environment variables" | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` isn't set in `apps/storefront/.env.local`. |
| Product photos don't show on the live site | Add your backend/image domain to `IMAGE_HOSTS` in the storefront env and rebuild. |
| Razorpay button missing at checkout | Razorpay isn't enabled for the India region (section 3, step 4). |
| Admin "Storefront" page shows errors | Run `npm run db:content && npm run db:migrate` in `apps/backend`. |

## What's included vs. the reference site

Built: announcement bar, sticky header with search, account, wishlist and cart; desktop mega-menu and mobile drawer menu from your categories; homepage slider; round category tiles; product rows; promo tiles; category pages with sub-category chips and sorting; search; wishlist (saved on the device); product pages with gallery, variant chips, quantity, wishlist and shipping note; cart; checkout with Razorpay; customer accounts and order history; mobile bottom navigation.

The design is original, inspired by the reference store's layout. Use your own product photos and descriptions.
