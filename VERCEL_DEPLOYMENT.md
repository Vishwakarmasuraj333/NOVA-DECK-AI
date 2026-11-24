# 🚀 Vercel Deployment Guide — NOVA DECK AI

This guide shows how to deploy **NOVA DECK AI** to [Vercel](https://vercel.com) in under 2 minutes.

---

## 1. Import Repository to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Under **Import Git Repository**, select:
   ```
   Vishwakarmasuraj333/NOVA-DECK-AI
   ```
4. Framework Preset: **Next.js** (detected automatically).

---

## 2. Configure Environment Variables in Vercel

In the Vercel Project Configuration screen, expand the **Environment Variables** section and add the following variables:

| Variable Name | Example Value | Purpose |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Google Gemini AI live outline & slide synthesis |
| `JWT_SECRET` | `novadeck_super_secure_secret_key_change_in_production_2026_xyz` | JWT session signature & authentication |
| `DATABASE_URL` | `file:./dev.db` | Application database |
| `NEXT_PUBLIC_APP_URL` | `https://your-project-name.vercel.app` | Public origin URL |
| `IMAGE_PROVIDER` | `placeholder` | Image generation service |

---

## 3. Build & Output Settings

The default settings work out of the box:
- **Build Command:** `npm run build` (runs `prisma generate && next build`)
- **Output Directory:** `.next`
- **Install Command:** `npm install`

---

## 4. Deploy

Click **Deploy**!
Vercel will build all 29 routes, optimize the static pages, and assign your live production URL (e.g., `https://nova-deck-ai.vercel.app`).
