# TradeCraft Architecture & Flow Documentation

## Overview

TradeCraft is a modern web application for stock analysis and trade planning. It provides institutional-grade trade plans, technical and fundamental analysis, and a suite of tools for both beginners and experienced traders. The platform is built with Next.js (App Router), React, TypeScript, and Tailwind CSS, and integrates with external APIs such as Finnhub for real-time stock data.

---

## Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **APIs:** Finnhub (stock data), Formspree (contact), Twelve Data (historical/indicators)
- **Authentication:** Google OAuth (NextAuth.js, Supabase)
- **Database/User Management:** Supabase (user records, upsert on sign-in)
- **Analytics:** Google Analytics (gtag.js)
- **Ads:** Google AdSense
- **Other:** Lucide React icons, Radix UI for tooltips/dialogs, Recharts for charting

---

## Main Modules & Responsibilities

### 1. Landing Page (`app/page.tsx`)

- **Hero Section:** Value proposition, call-to-action, quick access to trade plan generation.
- **FeatureSection:** Highlights key features.
- **HowItWorks:** Step-by-step workflow.
- **TestimonialsSection:** Social proof.
- **WinnersSection:** Showcases top trade results.

### 2. Trade Plan Generator (`app/trade-plan/page.tsx`)

- **Inputs:** Stock symbol, time horizon (swing, positional, long-term).
- **Data Fetch:**
  - Real-time quote and company profile from Finnhub API (`lib/services/finnhub.ts`, `app/api/finnhub/route.ts`).
  - Historical price and volume data (Twelve Data API via `lib/api.ts`).
- **Analysis Logic:**
  - Trend detection, volume analysis, support/resistance, ATR, breakout strength, setup type, technical indicators (RSI, MACD, EMA, Bollinger Bands, SMA, etc.).
  - Risk management: entry zone, stop loss, targets, trailing stops, position sizing.
  - Confidence level calculation.
- **Output:**
  - Detailed trade plan (entry, stop, targets, risk/reward, confidence, summary, avoidance reason).
  - Technical analysis and recommendations.
  - Shareable plan URL.
- **Components:** `TradingRecommendation`, `TechnicalAnalysis`, `RiskManagement`, `TradePlanHeader`.

### 3. Stock Screener (`app/screener/page.tsx`)

- **Filters:** Sector, market cap, technical signals, etc.
- **Results:** List of stocks matching criteria, trait scores, quick analysis.
- **Components:** `ScreenerFilters`, `ScreenerResults`.

### 4. Stock Analysis (`app/stock-analysis/page.tsx`)

- **Displays:**
  - Scorecard (performance, valuation, growth, profitability, entry point, red flags).
  - Key metrics (valuation, performance, market data, analyst ratings).
  - Peer comparison and company profile.
- **Components:** `StockAnalysis`.

### 5. Contact (`app/contact/page.tsx`)

- **Formspree integration** for user messages.
- **Validation:** Uses `react-hook-form` and `zod` for form validation.

### 6. Layout & UI

- **Header/Footer:** Navigation, branding, Buy Me a Coffee, legal info.
- **UI Components:** Cards, buttons, tabs, dialogs, tooltips, etc. (in `components/ui/`).
- **State Management:** Local state via React hooks; session via NextAuth.

---

## Data & API Flow

1. **User Action:**
   - Enters stock symbol and time horizon (trade plan) or applies screener filters.
2. **API Calls:**
   - `/api/finnhub` for real-time quote/profile (Finnhub).
   - `/api/stock-metrics` for computed metrics (Finnhub for quote/profile, but most analytics use historical data from Twelve Data).
   - `/api/technical-indicators` for indicators (Finnhub, but not used for main analytics).
   - **Twelve Data API** (via `lib/api.ts`) for all historical price/volume and technical indicators (RSI, MACD, BBands, etc.).
3. **Analysis:**
   - Core logic in `app/trade-plan/page.tsx` and `lib/stock-analysis.ts` uses historical data and indicators from Twelve Data for all analytics: trend, ATR, support/resistance, volume analysis, setup detection, risk management, and confidence scoring.
4. **UI Update:**
   - Results rendered in cards, tables, and charts.
   - Share, copy, and feedback actions (toasts, dialogs).

---

## Data Providers

- **Twelve Data:**
  - Source for all historical price/volume (used for trend, ATR, support/resistance, volume analysis, etc.).
  - Source for all technical indicators (RSI, MACD, Bollinger Bands, etc.).
  - Accessed via direct HTTP requests in `lib/api.ts` with API key rotation.
- **Finnhub:**
  - Source for real-time quote and company profile only.
  - Used for current price, company name, market cap, sector, etc.

---

## API Endpoints

### `/api/finnhub` (GET)

- **Params:** `symbol` (required, uppercase, e.g. AAPL or AAPL.NS)
- **Returns:** Real-time quote and company profile from Finnhub.
- **Errors:** 400 (missing/invalid symbol), 404 (not found), 429 (rate limit), 500 (other errors).

### `/api/stock-metrics` (GET)

- **Params:** `symbol` (required), `timeframe` (swing, positional, longterm; default: swing)
- **Returns:** Computed metrics (trend, SMA, breakout strength, etc.) using Finnhub data.
- **Errors:** 400 (missing/invalid symbol/timeframe), 404, 429, 500.

### `/api/technical-indicators` (GET)

- **Params:** `symbol` (required), `resolution` (default: D)
- **Returns:** Technical indicators (RSI, MACD, EMA200, Bollinger Bands) from Finnhub.
- **Errors:** 400 (missing symbol), 500.

### `/api/test` (GET)

- **Params:** `symbol` (optional, default: MSFT)
- **Returns:** Mock quote data for testing.

### `/api/auth/[...nextauth]` (GET, POST)

- **Purpose:** Google OAuth authentication via NextAuth.js, with user upsert to Supabase.

---

## Key Dependencies

- **@radix-ui/react-\***: UI primitives (dialogs, tooltips, etc.)
- **lucide-react:** Icons
- **recharts:** Charting
- **react-hook-form, zod:** Form validation
- **swr:** Data fetching (if used)
- **sonner:** Toast notifications
- **vaul:** Drawer UI
- **technicalindicators:** Technical analysis calculations

---

## Authentication & User Management

- **Google OAuth login** via NextAuth.js, with user upsert to Supabase on every sign-in (see `app/api/auth/[...nextauth]/route.ts`).
- **Supabase** is used as the backend database for user records. On sign-in, the user's email is upserted into the `users` table.
- **JWT-based session**, user ID attached to session.
- (Planned) Make login mandatory before generating a trade plan.

---

## File Structure (Key Files)

- `app/layout.tsx` — Root layout, header/footer, analytics scripts
- `app/page.tsx` — Landing page
- `app/trade-plan/page.tsx` — Trade plan generator and analysis
- `app/screener/page.tsx` — Stock screener
- `app/contact/page.tsx` — Contact form
- `components/layout/Header.tsx` — Header/navigation
- `components/layout/Footer.tsx` — Footer
- `lib/services/finnhub.ts` — Finnhub API integration
- `lib/types.ts` — TypeScript types
- `lib/stock-analysis.ts` — Core analysis logic
- `lib/supabase.ts` — Supabase client initialization

---

## End-to-End Flow Example

1. User lands on the homepage, sees value proposition.
2. User logs in (Google OAuth).
3. User enters a stock symbol and selects a time horizon.
4. App fetches data from APIs, runs analysis, and generates a trade plan.
5. User can view, share, or copy the plan.
6. User can explore screener, view stock analysis, or contact support.

---

## Extensibility

- Add authentication, user accounts, saved plans.
- More advanced screeners, community features, premium analytics.
- Easy to add new data providers or analytics modules.

---

## Database Schema (Supabase)

### users

- `id` (uuid, primary key, default: uuid_generate_v4()): Unique user identifier.
- `email` (text, unique, not null): User's email address.

### user_usage

- `user_id` (uuid, references users(id), on delete cascade): Foreign key to users table.
- `total_requests` (int, default 0): Cumulative API requests by the user.
- `date` (date): Date for usage tracking (per day).
- `request_count` (int, default 0): Number of requests on the given date.
- `last_request_at` (timestamptz): Timestamp of the last request.
- **Primary key:** (`user_id`, `date`)

### user_subscriptions

- `user_id` (uuid, references users(id), on delete cascade): Foreign key to users table.
- `plan_type` (text, check: 'free', 'pro', 'premium', default 'free'): Subscription plan type.
- `status` (text): Subscription status (active, cancelled, etc.).
- `renewal_date` (date): Next renewal date.
- `early_access` (boolean, default false): Early access flag.
- `lemonsqueezy_subscription_id` (text): External subscription provider ID.
- **Primary key:** (`user_id`)

---

_Last updated: 7 May 2025_
