# PayPal Subscription Integration Plan for TradeFinder

## Overview

This document details the step-by-step plan to integrate PayPal subscriptions into the TradeFinder app, enforce plan-based feature access and request limits, and ensure a seamless upgrade/downgrade experience for users. It is tailored for a Next.js/Supabase stack and assumes the provided Supabase schema is in place.

---

## 1. PayPal Integration

### 1.1. PayPal Button Setup

- Use the provided PayPal client ID and plan IDs for Pro and Premium subscriptions.
- On the `/pricing` page, replace the CTA for Pro and Premium with the PayPal subscription buttons.
- Dynamically render the correct button or status ("Current Plan", "Upgrade", etc.) based on the user's current plan.

### 1.2. Handling PayPal Subscription Approval

- On successful subscription (`onApprove`), call a backend API endpoint (e.g., `/api/paypal/subscribe`) with:
  - PayPal subscription ID
  - Plan type (pro/premium)
  - User's auth token (to identify user)
- **Do not trust the client for plan type.**
  - Fetch the actual plan from the PayPal API using the subscription ID to verify the plan and status before updating the user's plan in Supabase.
- Show a loading state and success/failure message to the user.

### 1.3. PayPal Webhook Listener

- Create an API route `/api/paypal/webhook` to receive PayPal subscription events.
- Validate webhook signatures using PayPal credentials.
- On `BILLING.SUBSCRIPTION.ACTIVATED` or `BILLING.SUBSCRIPTION.UPDATED`:
  - Extract the PayPal subscription ID and plan type.
  - Map the PayPal subscription to the user (see 1.4).
  - Fetch the actual plan from PayPal API to verify.
  - Update the `plan_type` in `user_subscriptions` for the user.
- On cancellation or failed payment, downgrade the user to `free`.
- **Add logging and retry logic:**
  - Log all webhook events and errors for auditing and troubleshooting.
  - If updating Supabase fails, log the error and retry (with exponential backoff or scheduled job).
- **Webhook Fallback:**
  - Implement a periodic polling job (e.g., daily) to fetch active subscriptions from PayPal and reconcile with Supabase in case webhooks fail.

### 1.4. User Mapping

- Pass the user's Supabase `user_id` as `custom_id` or metadata when creating the PayPal subscription.
- Store the PayPal subscription ID in `user_subscriptions.lemonsqueezy_subscription_id` (or add a new column if needed).
- If not possible, fallback to mapping by PayPal email (ensure emails match).
- **Duplicate Subscriptions:**
  - Before creating a new subscription, check if the user already has an active PayPal subscription ID in Supabase. If so, prompt to manage/cancel the existing one first.

### 1.5. Plan Upgrades/Downgrades

- Allow users to upgrade or downgrade plans:
  - If upgrading, create a new PayPal subscription and update Supabase after confirmation.
  - If downgrading, provide a way to cancel the current subscription (see 1.6).
  - If switching, recommend canceling the current subscription and subscribing to the new plan.

### 1.6. Subscription Management UI

- Provide a "Manage Subscription" link in the UI for Pro/Premium users.
  - This should link to the PayPal subscription management portal (use the PayPal subscription management URL for the user's subscription).
  - Optionally, show the current plan, renewal date, and a cancel button that opens PayPal's management page.

### 1.7. Logging & Monitoring

- Log all webhook events, subscription changes, and errors to a persistent store (e.g., Supabase table or external logging service).
- Monitor for failed webhook deliveries and alert if repeated failures occur.

---

## 2. Enforcing Plan-Based Limits

### 2.1. API Rate Limiting

- In the trade plan API route:
  - On each request, check the user's `plan_type` from `user_subscriptions`.
  - Check today's `request_count` in `user_usage` for the user.
  - Enforce limits:
    - Free: 5 requests/day
    - Pro: 100 requests/day
    - Premium: 1000 requests/day
  - If limit exceeded, return an error message.
  - On valid request, increment `request_count` and update `last_request_at`.
  - Reset `request_count` at midnight UTC (or use a rolling 24h window if preferred).

### 2.2. Momentum Screener Access

- In the screener API and UI:
  - Only allow Premium users to access the top 10 stocks.
  - For Free/Pro users, clicking the screener triggers a modal or message prompting upgrade, linking to `/pricing`.

---

## 3. Dynamic UI/UX Based on Plan

### 3.1. Pricing Page

- Show "Current Plan" badge for the user's current plan.
- Show "Upgrade" or "Downgrade" buttons as appropriate.
- Hide or disable PayPal buttons for the current plan.
- If user has an active subscription, show a "Manage Subscription" link.

### 3.2. Screener Page

- If user is not Premium, show an upgrade prompt/modal when they try to access the screener.

### 3.3. Navigation

- Optionally, add a "Manage Subscription" link for Pro/Premium users.

---

## 4. Database Changes & Usage Tracking

- The provided schema is sufficient:
  - `users` for user info
  - `user_usage` for daily request tracking
  - `user_subscriptions` for plan type and PayPal subscription ID
- Ensure `user_subscriptions` is updated on webhook events and on successful payment.
- Add a logging table for webhook and subscription events if detailed audit is required.

---

## 5. Security & Edge Cases

- Validate PayPal webhook signatures.
- Handle subscription cancellations, downgrades, and failed payments by updating `plan_type`.
- Prevent users from bypassing limits (e.g., by using multiple accounts).
- Ensure all plan changes are atomic and consistent.
- Log all critical actions for audit and troubleshooting.

---

## 6. Testing

- Test the full flow for each plan:
  - Subscribe, upgrade, downgrade, cancel.
  - Exceeding request limits.
  - Screener access for each plan.
  - UI/UX for each plan state.
- Test webhook handling and error cases.
- Test fallback polling and retry logic for webhooks.

---

## 7. What You Need to Provide

- PayPal webhook credentials (for validating webhook events).
- Confirmation on how to map PayPal subscriptions to users (custom_id, email, etc.).
- Any custom branding or copy for upgrade modals/messages.
- PayPal subscription management URL pattern (if not already known).

---

## 8. Implementation Steps (Summary)

1. Add PayPal buttons to `/pricing` and handle approval.
2. Create `/api/paypal/subscribe` to update user plan on approval (fetch plan from PayPal API, do not trust client).
3. Create `/api/paypal/webhook` to listen for PayPal events, verify plan from PayPal API, and update `user_subscriptions`.
4. Add logging and retry logic for webhook failures. Implement fallback polling job.
5. Enforce request limits in trade plan API using `user_usage` and `user_subscriptions`.
6. Restrict screener access to Premium users in both API and UI.
7. Update UI/UX on `/pricing` and screener page based on current plan. Add manage/cancel subscription link.
8. Test all flows and edge cases, including fallback and error handling.

---

This plan covers all required integration, security, and user experience details for a robust PayPal subscription system in your app, with fixes for all identified gaps and best practices for reliability and auditability.
