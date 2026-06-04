---
name: Admin role check security
description: adminAuth middleware role check bug and fix — any valid user JWT was accepted for admin routes without role check.
---

# Admin role check security fix

## The rule
`adminAuth` in `artifacts/api-server/src/middlewares/adminAuth.ts` must verify `decoded.role === "admin"` after JWT verification. Without this, any authenticated user can access admin endpoints.

**Why:** The middleware was only verifying the JWT signature, not the payload role. User JWTs have `{ userId, email }` (no role field). Admin JWTs have `{ role: "admin" }`. Without the role check, user tokens passed the admin gate.

**How to apply:** After `jwt.verify()`, always check `if (decoded.role !== "admin") return res.status(403).json(...)` before calling `next()`.

## Resulting behavior
- Admin routes return **403** (not 401) when a valid user token (wrong role) is used.
- Admin routes return **401** when no token or an invalid token is used.
- Test assertions for "customer blocked from admin" should check for 403, not 401.
