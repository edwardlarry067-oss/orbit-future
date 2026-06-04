---
name: Stripe key validation
description: Detecting publishable vs secret key misconfiguration in Stripe routes.
---

# Stripe key validation

## The rule
Before calling `getStripe()`, both `stripe-plan-pay` and `stripe-token-buy` routes explicitly check `if (stripeKey.startsWith("pk_"))` and return **503** with a human-readable error: "Stripe is misconfigured: a publishable key was provided. Please set STRIPE_SECRET_KEY to your secret key (sk_...) from the Stripe dashboard."

**Why:** A user configured STRIPE_SECRET_KEY with their Stripe publishable key (pk_...) instead of the secret key (sk_...). This caused a `StripePermissionError` and a cryptic 500 response. The fix returns 503 immediately with a clear message before Stripe is even called.

**How to apply:** Any time a Stripe route creates a `getStripe()` instance, add a pre-check for `pk_` prefix and return 503. The `getStripe()` function itself also throws descriptively.

## Test behavior
When STRIPE_SECRET_KEY is a publishable key, Stripe tests correctly emit warnings (not failures) because 503 is an expected configuration issue, not a code bug.
