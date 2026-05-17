# UPFACE — AI Facial Analysis SaaS

Dark, premium looksmaxxing SaaS. Upload a photo → AI analyzes 47 facial points in 8 seconds → personalized score + 30-day routine.

## Stack

- **Next.js 15** (App Router, TypeScript strict)
- **Tailwind CSS v4**
- **Supabase** (Auth + PostgreSQL + Storage)
- **OpenAI GPT-4o Vision**
- **next-intl** (FR/EN, FR by default)
- **Resend** (transactional emails)
- **@vercel/og** (OG image generation)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `lib/supabase-schema.sql`
3. Go to **Authentication → Providers** and enable:
   - Email/Password
   - Google OAuth (add your `NEXT_PUBLIC_APP_URL/api/auth/callback` as redirect URL)
4. Go to **Storage** and verify the `photos` bucket was created (or create it manually as public)

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note:** Without `OPENAI_API_KEY`, the app uses realistic mock data automatically. You can test the full funnel without OpenAI.

---

## User Funnel

```
/ (Landing)
  → /analyze        (Upload photo)
  → /analyzing      (Scan animation + API call)
  → /signup         (Auth gate — if not logged in)
  → /results/[id]   (Score reveal — public, shareable)
  → /checkout       (Paywall UI — no Stripe yet)
  → /dashboard      (Protected — auth required)
```

## Project Structure

```
/app
  /[locale]           next-intl locale routing
    page.tsx          Landing page
    /analyze          Upload step
    /analyzing        Scan animation + API call
    /signup           Auth gate
    /login            Login page
    /results/[id]     Score reveal (public)
    /checkout         Paywall UI
    /dashboard        Protected dashboard
      /history        Analysis history
      /routine        30-day routine
      /settings       Account settings
  /api
    /analyze          POST — GPT-4o Vision analysis
    /auth/callback    Supabase OAuth callback
    /og               Dynamic OG image

/components
  /ui                 Reusable UI components
  /layout             Navbar, Footer, Dashboard nav
  /sections           Landing page sections
  /results            ShareButton

/lib
  supabase.ts         Browser client
  supabase-server.ts  Server client (cookies)
  openai.ts           OpenAI singleton
  analyze.ts          GPT-4o scoring + mock fallback
  i18n.ts             next-intl config

/messages
  fr.json             French translations
  en.json             English translations
```

## Environment Variables Reference

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server only) |
| `OPENAI_API_KEY` | OpenAI API key (sk-...). Optional — uses mock if absent |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `NEXT_PUBLIC_APP_URL` | Your app URL (http://localhost:3000 in dev) |

## Database Schema

Two tables: `analyses` and `routine_progress`. Both use Row Level Security.

Run `lib/supabase-schema.sql` in the Supabase SQL editor to set them up.

## Features

- **Landing page** — Hero with animated badge, stat row, HowItWorks, Score Demo (scroll reveals), Routine Preview, Pricing (3 tiers)
- **Upload funnel** — Drag & drop, formats JPG/PNG/HEIC/WEBP, max 10MB, Supabase Storage
- **Scan animation** — 8s progress bar, cycling status messages, blue scan line
- **Auth gate** — Signup/Login with Google OAuth + email/password (Supabase)
- **Score reveal** — Animated ScoreRing SVG, BreakdownBars, TraitCards (3 free / 2 locked), ShareButton
- **Paywall** — UI only (no Stripe), toast on CTA: "Paiement bientôt disponible"
- **Dashboard** — KPI cards, mini SVG chart, last analysis, routine (Pro-gated), settings
- **i18n** — French (default) and English via next-intl
- **OG images** — Dynamic `/api/og?score=74&tier=attractive`

## Deploying to Vercel

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

In Supabase, add your Vercel production URL to:
- Authentication → URL Configuration → Site URL
- Authentication → URL Configuration → Redirect URLs: `https://your-app.vercel.app/api/auth/callback`

## Adding Stripe (future)

When ready to add payments:
1. `npm install stripe @stripe/stripe-js`
2. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
3. Replace the toast in `/checkout` with real Stripe Checkout
4. Add a `subscriptions` table to track plan status
5. Update `isPro` checks throughout the dashboard

## License

Private — all rights reserved.
