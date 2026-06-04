---
name: Cancel Subscription Endpoint
description: Two cancel mechanisms exist — understand which is which.
---

## Endpoints
1. `POST /api/subscriptions/:id/cancel` — customer-facing convenience endpoint. Validates ownership via JWT email claim. Dashboard uses this.
2. `PATCH /api/subscriptions/:id` with `{status: "cancelled"}` — admin or user can use. Admin uses this from the admin subscriptions page.

**Why:** The dashboard was calling POST /cancel which didn't exist — only PATCH existed. Both now work and both send the cancellation email.

**How to apply:** New UI features for customers should use POST /cancel; admin tools can use PATCH.
