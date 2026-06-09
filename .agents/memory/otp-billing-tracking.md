---
name: OTP + Billing + Tracking System
description: Passwordless OTP login, invoice auto-generation, SSE real-time order tracking, account numbers, domain cleanup decisions.
---

## OTP Auth (routes/otp.ts)
- POST /api/auth/otp/send — sends 6-digit code; when RESEND_API_KEY not set, returns devOtp in response (dev mode)
- POST /api/auth/otp/verify — verifies code, auto-creates user if new email, issues JWT
- Rate limits: 3 send/10min per email, 5 verify/5min per email (in-memory map)
- Auto-creates user with name derived from email prefix on first OTP login
- Account number ORB-XXXX assigned immediately on auto-create

## Account Numbers
- Format: `ORB-${String(userId).padStart(4, "0")}` (e.g. ORB-0001)
- Assigned on: registration (auth.ts), OTP first-login (otp.ts)
- Backfill: backfillAccountNumbers() runs on startup for existing users without one
- Exposed in all user API responses (auth/me, login, register, patch me)

## Invoice System (lib/invoiceService.ts)
- createInvoice() called automatically after paystack-plan-verify succeeds
- Invoice number format: INV-YYYYMM-XXXX (4-digit random suffix, retry on collision)
- Stored in invoices table; status="paid", paidAt=now for immediate payment
- Line items: hardware (first month only if plan.hardwarePrice > 0) + monthly service

## SSE Tracking (routes/tracking.ts)
- GET /api/subscriptions/:id/tracking-stream — SSE endpoint, accepts ?token=JWT in query
- Admin: PATCH /api/subscriptions/:id/tracking-status — updates DB + broadcasts to connected SSE clients
- Stages: pending → processing → shipped → delivered → activated → completed
- In-memory sseClients Map; heartbeat every 25s; cleanup on client disconnect

## Domain
- All orbitfuture.com references replaced with orbitfuture.store everywhere in codebase
- email.ts FROM_EMAIL, SUPPORT_EMAIL, APP_URL all default to orbitfuture.store
- CORS in app.ts only allows orbitfuture.store (not .com anymore)
- paystack.ts APP_URL fallback is orbitfuture.store

**Why:** Platform migration from .com to .store domain; ensures emails, links, and CORS all consistently point to the new domain.

**How to apply:** When adding any new email template, API redirect URL, or CORS origin, always use orbitfuture.store not orbitfuture.com.
