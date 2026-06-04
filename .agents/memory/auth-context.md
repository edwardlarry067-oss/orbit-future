---
name: Auth Context Pattern
description: How to update user data from components — use AuthContext methods, not manual fetch.
---

## Rule
`useAuth()` exposes: `user, token, loading, login, register, logout, updateProfile, refreshUser`. It does NOT expose `setUser`.

- **Profile updates**: call `updateProfile({ name, phone, address })` — it calls PATCH /api/auth/me and updates user state internally.
- **Password change**: call `updateProfile({ password: currentPw, newPassword: newPw })`.
- **After external fetch**: call `refreshUser()` — it re-fetches /api/auth/me and updates context.

**Why:** `setUser` is intentionally kept internal to AuthContext to avoid stale state. Always go through context methods.

**How to apply:** Dashboard ProfileSection uses `updateProfile` prop passed from Dashboard which pulls from `useAuth()`.
