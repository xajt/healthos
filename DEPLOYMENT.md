# HealthOS Deployment Guide

## Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase account
- Vercel account (optional, for deployment)

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Database Setup

1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` to create tables
3. Run `supabase/rls-policies.sql` to enable RLS

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Run E2E tests (requires Playwright browsers)
pnpm exec playwright install
pnpm exec playwright install-deps chromium
pnpm test:e2e
```

## Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Vercel Deployment

1. Install Vercel CLI:
   ```bash
   pnpm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## PWA Installation

The app is installable as a PWA on mobile devices:
1. Open the app in Chrome/Safari on mobile
2. Tap "Add to Home Screen" or "Install App"
3. The app will appear on your home screen

## Features

- Authentication (Email, Google, Apple)
- Calorie tracking with Open Food Facts API
- Weight, water, and supplement tracking
- Sleep and mood monitoring
- Blood test results with AI analysis
- Workout tracking
- Meditation timer
- AI health chatbot
- Data export (CSV, PDF)
- Weather integration

## Tech Stack

- Next.js 15.3.3
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Auth, Database, Storage)
- Recharts
- Playwright (E2E)
- Vitest (Unit tests)
