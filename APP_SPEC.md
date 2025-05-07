# TradeCraft App Specification

## Overview

TradeCraft is a modern web application designed to help traders make informed, data-driven decisions in the stock market. It provides institutional-grade trade plans, technical and fundamental analysis, and a suite of tools for both beginners and experienced traders. The platform is built with Next.js (App Router), React, and Tailwind CSS, and integrates with external APIs such as Finnhub for real-time stock data.

---

## Features

### 1. Landing Page

- **Hero Section:** Clear value proposition, call-to-action, and quick access to trade plan generation.
- **Feature Highlights:** Overview of key features (trade plans, screener, analysis, etc.).
- **How It Works:** Step-by-step explanation of the platform's workflow.
- **Testimonials:** Social proof from real users.
- **Buy Me a Coffee:** Subtle donation option with messaging for community support.

### 2. Trade Plan Generator

- **Stock Symbol Input:** Users can enter a stock symbol (e.g., AAPL, MSFT, TCS.NS).
- **Time Horizon Selection:** Choose between swing, positional, or long-term trade plans.
- **Plan Generation:** Generates a detailed trade plan with:
  - Entry zone
  - Stop loss
  - Multiple targets
  - Risk/reward ratio
  - Confidence level
  - Technical and fundamental context
  - Key support/resistance levels
  - Trade setup type (breakout, support bounce, trend continuation)
- **Share Plan:** Button to copy the plan URL for sharing.

### 3. Stock Screener

- **Custom Filters:** Filter stocks by sector, market cap, technical signals, etc.
- **Results Table:** View and sort stocks matching criteria.
- **Quick Analysis:** Click a stock to view a summary analysis and generate a trade plan.

### 4. Technical & Fundamental Analysis

- **Technical Indicators:** RSI, MACD, EMA, Bollinger Bands, ATR, etc.
- **Trend Detection:** Uptrend, downtrend, sideways, recent trend changes.
- **Volume Analysis:** Volume spikes, confirmation, and anomalies.
- **Support/Resistance:** Automatic detection of key levels.
- **Breakout Strength:** Quantitative score for breakout reliability.
- **Risk Management:** Entry, stop, targets, trailing stops, position sizing.
- **Fundamental Metrics:** Market cap, P/E, sector, earnings, etc. (where available).

### 5. Social Proof & Community

- **Testimonials:** Rotating or static user reviews.
- **Buy Me a Coffee:** Donation option with personal messaging.

### 6. Contact & Support

- **Contact Form:** Users can send questions or feedback via Formspree integration.
- **Footer Links:** Privacy, Terms, Disclaimer, Contact, About.

### 7. Analytics & Monetization

- **Google Analytics:** Tracks user behavior and engagement.
- **Google AdSense:** Monetization via ads.

---

## User Flow

1. **Landing Page:**

   - User sees the value proposition, testimonials, and can immediately start generating a trade plan.
   - Navigation bar provides access to Screener, Trade Plan, Contact, etc.

2. **Generate Trade Plan:**

   - User enters a stock symbol and selects a time horizon.
   - App fetches data, runs analysis, and displays a detailed plan.
   - User can share the plan, review technicals, and see risk management details.

3. **Explore Screener:**

   - User applies filters to find stocks with specific characteristics.
   - Clicks a stock to view analysis or generate a plan.

4. **Contact:**

   - User fills out the contact form for support or feedback.

5. **Support the Platform:**
   - User can donate via Buy Me a Coffee (icon in header, section in footer).

---

## Core Calculations & Logic

### Trade Plan Generation

- **Input:** Stock symbol, time horizon (swing, positional, long-term)
- **Data Fetch:**
  - Real-time quote and company profile from Finnhub API
  - Historical price and volume data
- **Technical Analysis:**
  - **Trend Detection:**
    - Calculate uptrend, downtrend, or sideways using price changes over recent periods
    - Detect recent trend changes (short-term vs. long-term)
  - **Volume Analysis:**
    - Detect volume spikes (recent vs. average)
    - Confirm trend with volume
  - **Support/Resistance:**
    - Identify swing highs/lows in price history
    - Remove duplicates, sort, and select nearest levels
  - **ATR (Average True Range):**
    - Calculate volatility for stop loss and target placement
  - **Breakout Strength:**
    - Score based on volume, price action, and setup type
  - **Setup Type Detection:**
    - Bullish breakout, support bounce, trend continuation
  - **Indicators:**
    - RSI, MACD, EMA, Bollinger Bands, SMA, etc.
- **Risk Management:**
  - Entry zone (price range)
  - Initial stop loss (fixed or trailing)
  - Multiple targets (risk/reward multiples)
  - Trailing stops (ATR-based)
  - Position sizing suggestion
- **Confidence Level:**
  - High, medium, low based on probability score, risk/reward, and volume confirmation
- **Summary & Avoidance Reason:**
  - Human-readable summary of the plan
  - Warning if the setup is not favorable

### Screener Logic

- **Filters:** Sector, market cap, technical signals, etc.
- **Results:** List of stocks matching criteria
- **Quick Analysis:** On click, fetches and displays summary analysis

### Contact Form

- **Formspree Integration:**
  - Name, email, message fields
  - Success/error feedback

### Social Proof

- **Testimonials:**
  - Static or rotating user reviews
- **Buy Me a Coffee:**
  - Icon in header with tooltip
  - Section in footer with personal message

### Analytics & Ads

- **Google Analytics:**
  - Tracks page views, user flow, and engagement
- **Google AdSense:**
  - Displays ads for monetization

---

## UI/UX Details

- **Header:**
  - Logo, navigation links, subtle Buy Me a Coffee icon with tooltip
- **Footer:**
  - Company info, resources, legal, contact, Buy Me a Coffee message/button
- **Responsive Design:**
  - Mobile-friendly, grid layouts, accessible forms
- **Modern Aesthetics:**
  - Tailwind CSS, clean cards, soft backgrounds, clear CTAs
- **Feedback:**
  - Toasts for actions (e.g., "Link copied!")
  - Success/error messages for forms

---

## Technology Stack

- **Frontend:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **APIs:** Finnhub (stock data), Formspree (contact)
- **Analytics:** Google Analytics (gtag.js)
- **Ads:** Google AdSense
- **Other:** Lucide React icons, Radix UI for tooltips and dialogs

---

## Extensibility & Future Ideas

- User authentication and saved plans
- More advanced screeners (fundamental, options, etc.)
- Community features (comments, sharing, leaderboards)
- Premium features (alerts, advanced analytics)
- Mobile app version

---

## File Structure (Key Files)

- `app/layout.tsx` — Root layout, includes header/footer and analytics scripts
- `app/page.tsx` — Landing page
- `app/trade-plan/page.tsx` — Trade plan generator and analysis
- `app/screener/page.tsx` — Stock screener
- `app/contact/page.tsx` — Contact form
- `components/layout/Header.tsx` — Header/navigation
- `components/layout/Footer.tsx` — Footer
- `components/ui/BuyMeCoffeeButton.tsx` — Buy Me a Coffee button/icon
- `components/ui/BuyMeCoffeeMessage.tsx` — Footer message for donations
- `lib/services/finnhub.ts` — Finnhub API integration
- `lib/types.ts` — TypeScript types
- `lib/stock-analysis.ts` — Core analysis logic

---

## API Specification

## Overview

This document describes the API endpoints exposed by the TradeCraft application, including authentication, stock data, metrics, and technical indicators. All endpoints return JSON responses.

---

## Authentication

### `POST /api/auth/[...nextauth]`

- **Purpose:** Google OAuth login via NextAuth.js. On sign-in, user email is upserted to Supabase.
- **Request:**
  - Handled by NextAuth.js (OAuth flow)
- **Response:**
  - Session JWT, user info
- **Errors:**
  - Standard NextAuth errors

---

## Stock Data Endpoints

### `GET /api/finnhub`

- **Description:** Fetches real-time quote and company profile for a given stock symbol (from Finnhub).
- **Query Parameters:**
  - `symbol` (string, required): Stock symbol (e.g., AAPL, AAPL.NS)
- **Response:**
  - Real-time quote and company profile (Finnhub only)

---

### `GET /api/stock-metrics`

- **Description:** Returns computed stock metrics for a symbol and timeframe.
- **Query Parameters:**
  - `symbol` (string, required)
  - `timeframe` (string, optional: swing | positional | longterm, default: swing)
- **Response:**
  - Metrics are computed using real-time quote/profile from Finnhub **and** historical price/volume from Twelve Data (via `getStockData` in `lib/api.ts`).
  - All analytics (trend, ATR, support/resistance, volume spike, setup detection, etc.) are based on historical data and indicators from Twelve Data.

---

### `GET /api/technical-indicators`

- **Description:** Returns technical indicators for a symbol and resolution (Finnhub, but not used for main analytics).

---

## Twelve Data API (via `lib/api.ts`)

- **Endpoints Used:**
  - `/time_series` for historical price/volume (30 days)
  - `/rsi`, `/macd`, `/bbands` for technical indicators
- **Data Used For:**
  - All analytics, risk management, and trade plan logic in `app/trade-plan/page.tsx`
  - Trend, ATR, support/resistance, volume analysis, setup detection, confidence scoring, and technical analysis UI
- **API Key Rotation:**
  - Multiple API keys are rotated for reliability and quota management

---

## Error Handling

- All endpoints return appropriate HTTP status codes and a JSON error message on failure.
- Rate limiting and API quota errors are surfaced to the client.

---

_Last updated: 7 May 2025_
