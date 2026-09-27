# Deploying REXTON WATCHES to Vercel

REXTON WATCHES is built with Next.js 14 App Router and is fully optimized for **Vercel** serverless deployment.

---

## ⚡ Quick 2-Minute Deployment (GitHub → Vercel)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "feat: REXTON Swiss Horology luxury store"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/rexton-watches.git
git push -u origin main
```

---

### Step 2: Import Project on Vercel
1. Go to [vercel.com/new](https://vercel.com/new) and log in with GitHub.
2. Select the **`rexton-watches`** repository and click **Import**.
3. Framework Preset will automatically detect: **Next.js**.
4. Root Directory: `./`

---

### Step 3: Configure Database on Vercel
Since Vercel uses serverless functions, connect any hosted database:

#### Option A: Free Neon / Supabase / Aiven / Railway (Recommended)
1. Create a free database on [Neon.tech](https://neon.tech), [Supabase.com](https://supabase.com), or [Aiven.io](https://aiven.io).
2. Copy your connection string (e.g. `postgres://...` or `mysql://...`).

#### Option B: Hostinger Remote MySQL
If you have a MySQL database on Hostinger, allow remote access in Hostinger hPanel and use:
```env
DATABASE_URL="mysql://u123456_rexton:Password@hostinger_server_ip:3306/u123456_rexton"
```

---

### Step 4: Add Environment Variables in Vercel Dashboard

In the **Environment Variables** section of the Vercel deployment modal, add:

| Name | Value | Description |
|---|---|---|
| `DATABASE_URL` | `mysql://...` or `postgres://...` or `file:./dev.db` | Database connection string |
| `NEXT_PUBLIC_APP_URL` | `https://your-rexton-app.vercel.app` | Production app URL |
| `AUTH_SECRET` | `rexton_super_secret_jwt_key_2026_luxury_production` | Generated 32-char secret |
| `AUTH_COOKIE_NAME` | `rexton_session` | Session cookie identifier |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_...` or `rzp_live_...` | Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | `your_razorpay_secret` | Razorpay Secret |
| `RAZORPAY_WEBHOOK_SECRET` | `your_webhook_secret` | Webhook verification secret |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `rexton-watches` | Cloudinary Cloud Name |
| `CLOUDINARY_API_KEY` | `your_cloudinary_key` | Cloudinary Key |
| `CLOUDINARY_API_SECRET` | `your_cloudinary_secret` | Cloudinary Secret |
| `SMTP_HOST` | `smtp.hostinger.com` | SMTP Host |
| `SMTP_PORT` | `465` | SMTP Port |
| `SMTP_SECURE` | `true` | Secure SSL |
| `SMTP_USER` | `concierge@rexton.com` | Mailbox user |
| `SMTP_PASSWORD` | `your_password` | Mailbox password |
| `EMAIL_FROM` | `REXTON Concierge <concierge@rexton.com>` | Sender string |

---

### Step 5: Click "Deploy"
Vercel will run `prisma generate && next build` and deploy your luxury Swiss watchmaking store in ~45 seconds!

---

### Step 6: Seed Database & Super Admin
After deployment, run the seed script to populate timepieces and create the Super Admin:

```bash
# Push schema to your cloud database
npx prisma db push

# Seed Swiss watch catalog & Super Admin
node prisma/seed.js
```

### 🔑 Super Admin Credentials
- **Portal**: `https://your-rexton-app.vercel.app/admin/login`
- **Email**: `admin@rexton.com`
- **Password**: `Admin@Rexton2026!`
