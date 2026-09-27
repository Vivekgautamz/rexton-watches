# REXTON WATCHES — Swiss Timeless Root
### Production E-Commerce Platform Optimized for Hostinger Node.js Web Apps & MySQL

---

## 🏛️ Architecture Overview

REXTON is a luxury Swiss-inspired horology e-commerce platform engineered with:
- **Frontend & Server**: Next.js (App Router, Server Components & Server Actions, React 18, TypeScript)
- **Styling**: Vanilla CSS & Tailwind CSS (Swiss Horology Minimalist Palette `#0C0C0C`, `#C5A880`, `#FAF9F6`)
- **Database & ORM**: MySQL (Hostinger Managed MySQL) + Prisma ORM
- **Payment Gateway**: Razorpay (HMAC-SHA256 signature verification, server order creation, idempotent webhooks)
- **Asset Delivery**: Cloudinary (Automatic responsive WebP/AVIF formatting, quality compression)
- **Email Dispatch**: Nodemailer SMTP (Hostinger Titan Mail, Google Workspace, or Resend)
- **Security**: Strict Server RBAC (`SUPER_ADMIN`, `ADMIN`, `STAFF`, `CUSTOMER`), bcrypt password hashing, HTTP-Only SameSite cookies, atomic database transactions.

---

## 🚀 Hostinger Node.js Web Apps Deployment Guide

Follow these exact steps to deploy REXTON to Hostinger:

### Step 1: Create a MySQL Database on Hostinger
1. Log in to your **Hostinger hPanel**.
2. Navigate to **Databases** → **MySQL Databases**.
3. Create a new database:
   - **Database Name**: `u123456789_rexton`
   - **Username**: `u123456789_rexton_user`
   - **Password**: Create a strong password (e.g., `RexSwiss2026!SecureKey`)
4. Note your database credentials and hostname (usually `127.0.0.1` or `localhost`).

Your `DATABASE_URL` format will be:
```env
DATABASE_URL="mysql://u123456789_rexton_user:RexSwiss2026!SecureKey@localhost:3306/u123456789_rexton"
```

---

### Step 2: Push Repository to GitHub
Push your local code to your GitHub account:
```bash
git init
git add .
git commit -m "feat: initial production build of REXTON WATCHES"
git branch -M main
git remote add origin https://github.com/your-username/rexton-watches.git
git push -u origin main
```

---

### Step 3: Create Node.js Web App in Hostinger hPanel
1. In Hostinger hPanel, go to **Websites** → **Add Website** or **Node.js Web Apps**.
2. Connect your **GitHub** account and select the `rexton-watches` repository (`main` branch).
3. Configure the Node.js application settings:
   - **Node.js Version**: Select `Node.js 20.x LTS` or `Node.js 22.x LTS`.
   - **Application Root**: `/`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: Hostinger automatically assigns the port via `process.env.PORT`.

---

### Step 4: Configure Environment Variables
In Hostinger Node.js Web App settings, add the following environment variables:

| Variable | Description | Example / Note |
|---|---|---|
| `DATABASE_URL` | MySQL Connection URL | `mysql://user:pass@localhost:3306/dbname` |
| `NEXT_PUBLIC_APP_URL` | Domain URL | `https://yourdomain.com` |
| `AUTH_SECRET` | Secret for JWT & Sessions | Generate with `openssl rand -base64 32` |
| `AUTH_COOKIE_NAME` | Session cookie name | `rexton_session` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_live_xxxxxxxx` or `rzp_test_xxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Secret | Secret from Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | Webhook signature secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `rexton-watches` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Your Cloudinary Key |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Your Cloudinary Secret |
| `SMTP_HOST` | SMTP Server | `smtp.hostinger.com` |
| `SMTP_PORT` | SMTP Port | `465` |
| `SMTP_SECURE` | Secure SMTP | `true` |
| `SMTP_USER` | SMTP User | `concierge@yourdomain.com` |
| `SMTP_PASSWORD` | SMTP Password | Mailbox Password |
| `EMAIL_FROM` | Sender Name & Address | `REXTON Concierge <concierge@yourdomain.com>` |

---

### Step 5: Run Database Migrations & Initial Swiss Seeding
Run the following commands in the Hostinger web terminal or via local SSH connection:

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to MySQL
npx prisma db push

# Seed Swiss watch catalog, categories, collections, and Super Admin
node prisma/seed.js
```

---

## 🔑 Default Super Admin Credentials

After running `node prisma/seed.js`:
- **Admin Portal URL**: `https://yourdomain.com/admin/login`
- **Email**: `admin@rexton.com`
- **Password**: `Admin@Rexton2026!`
- **Role**: `SUPER_ADMIN`

*(Note: Please change the password in production via your profile or database).*

---

## 💳 Razorpay Webhook Configuration
1. Open your **Razorpay Dashboard** → **Settings** → **Webhooks**.
2. Add a new webhook URL: `https://yourdomain.com/api/checkout/webhook`.
3. Set Webhook Secret matching `RAZORPAY_WEBHOOK_SECRET`.
4. Select the events:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`

---

## 🛠️ Local Development

To run locally on your machine:
```bash
# 1. Install dependencies
npm install

# 2. Configure .env file with your local or Hostinger remote MySQL credentials
cp .env.example .env

# 3. Generate Prisma client
npm run prisma:generate

# 4. Push schema & seed
npm run prisma:push
npm run prisma:seed

# 5. Start dev server
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 💎 Features Built Into REXTON

- **Storefront**:
  - Swiss horology editorial homepage with curated series, master calibres, and newsletter.
  - Full watch catalog (`/shop`) with multi-facet server filtering by category, collection, movement, and price.
  - Dynamic timepiece page (`/product/[slug]`) with zoomable visual gallery, full technical specifications table, reviews, stock status, and instant checkout.
  - Curated collections (`/collections`, `/collections/[slug]`).
  - Slide-over acquisition bag drawer with live promotional coupon validation and order summary.
  - Razorpay checkout (`/checkout`) with HMAC SHA256 signature verification and atomic database transactions.
  - Official Order Certificate & Receipt view (`/order-success`).
  - Customer Collector Portal (`/account`, `/account/orders`, `/account/wishlist`, `/account/addresses`).
  - Editorial Horology Gazette (`/journal`, `/journal/[slug]`).
  - Concierge & Boutique appointments (`/contact`, `/faq`, `/about`).
  
- **Admin Console (`/admin`)**:
  - Secure RBAC guards (`SUPER_ADMIN`, `ADMIN`, `STAFF`).
  - Product catalog CRUD (`/admin/products`, `/admin/products/new`, `/admin/products/[id]`).
  - Orders & courier dispatch manager (`/admin/orders`, `/admin/orders/[id]`).
  - Stock ledger with audit logging (`/admin/inventory`).
  - Promotional privilege code issuer (`/admin/coupons`).
  - Customer review moderation (`/admin/reviews`).
  - Collections and Categories manager (`/admin/collections`, `/admin/categories`).
  - Analytics & Gross Settlement Telemetry (`/admin/analytics`).
  - System and infrastructure status (`/admin/settings`).

- **SEO & Performance**:
  - Full OpenGraph tags & Twitter Cards.
  - JSON-LD Structured Data: `Organization` & `Product` schemas.
  - Dynamic `sitemap.xml` and `robots.txt`.
  - Next.js image optimization with WebP/AVIF format support.
