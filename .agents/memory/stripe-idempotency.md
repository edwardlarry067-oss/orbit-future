---
name: Stripe Plan Verify Idempotency
description: How duplicate Stripe payment verification calls are prevented.
---

## Rule
`POST /api/stripe-plan-verify` checks if a subscription with the same `stripeSubscriptionId` (= session.payment_intent ?? session_id) already exists BEFORE inserting. If found, returns the existing subscription without re-inserting or re-emailing.

**Why:** Stripe can redirect users multiple times to the success URL (browser back, page refresh). Without idempotency check, each redirect would create a duplicate subscription row.

**How to apply:** Any new payment verification endpoint should do the same lookup-first pattern. The field used is `subscriptionsTable.stripeSubscriptionId`.

## Email Sending
After successful first insert only: sends `sendSubscriptionConfirmation` + `sendPaymentReceipt` both async with `.catch(() => {})`.
