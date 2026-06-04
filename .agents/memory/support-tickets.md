---
name: Support Ticket System
description: Architecture of the ORBITFUTURE support ticket system — DB, API, frontend tabs, admin page.
---

## DB Table
`support_tickets` — id, ticketRef (ORB-XXXXXXXX), customerName, customerEmail, subject, message, status (open/replied/resolved/closed), priority, adminReply, adminRepliedAt, createdAt, updatedAt. Migrated via `drizzle-kit push`.

## API (artifacts/api-server/src/routes/support.ts)
- `POST /api/support/tickets` — public, no auth, creates ticket with unique ORB-XXXXXXXX ref
- `GET /api/support/tickets?email=...` or `?ref=...` — customer lookup, no auth
- `GET /api/admin/support/tickets` — adminAuth, status filter, pagination
- `PATCH /api/admin/support/tickets/:id` — adminAuth, updates status + adminReply; triggers sendSupportReply email
- `DELETE /api/admin/support/tickets/:id` — adminAuth

## Frontend
- `/support` — 3-tab layout: Contact Us / Open Ticket / Track Ticket (artifacts/spacex-starlink/src/pages/support.tsx)
- `/admin/tickets` — admin page with expand/reply modal, status filter, quick status change (artifacts/spacex-starlink/src/pages/admin/tickets.tsx)

## Email
Uses `sendSupportReply` from email.ts when admin replies via PATCH.

**Why:** Customers needed a proper ticketing system beyond WhatsApp redirect; admin needed to track/reply to tickets from one place.
