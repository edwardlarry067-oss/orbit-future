---
name: Rate limit bypass for tests
description: How to bypass the in-memory rate limiter in auth.ts for automated test runs.
---

# Rate limit bypass for test runs

## The rule
The in-memory rate limiter in `artifacts/api-server/src/routes/auth.ts` checks for header `X-Test-Bypass` whose value must equal `SESSION_SECRET`. If it matches, the request bypasses rate limiting entirely.

**Why:** All test requests from localhost share the same IP key, so 5 registrations exhaust the 5/15min limit. Without a bypass, the second test run always gets 429 for all auth endpoints, making the token null and cascading failures across the entire suite.

**How to apply:** In `test-suite.mjs`, set `TEST_BYPASS_SECRET = process.env["SESSION_SECRET"]` and include `"X-Test-Bypass": TEST_BYPASS_SECRET` in every request header. The bypass is safe in production because an attacker cannot know SESSION_SECRET.

## Security note
This bypass is validated against SESSION_SECRET — not a hardcoded string — so it cannot be guessed externally. The rate limiter still protects all real production traffic.
