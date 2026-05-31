import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { createHash } from "node:crypto";
import { JWT_SECRET } from "../middlewares/adminAuth";

const router = Router();
const JWT_EXPIRES = "30d";

// ── In-memory rate limiter ─────────────────────────────────────────────────────
const rateLimitStore = new Map<string, { attempts: number; resetAt: number }>();

function rateLimit(maxAttempts: number, windowMs: number) {
  return (req: any, res: any, next: any): void => {
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.socket.remoteAddress ?? "unknown";
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record || now > record.resetAt) {
      rateLimitStore.set(key, { attempts: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.attempts >= maxAttempts) {
      const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSec));
      res.status(429).json({
        error: "Too many attempts. Please try again later.",
        retryAfter: retryAfterSec,
      });
      return;
    }

    record.attempts += 1;
    next();
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) rateLimitStore.delete(key);
  }
}, 10 * 60 * 1000);

function hashPassword(password: string): string {
  return createHash("sha256").update(password + JWT_SECRET).digest("hex");
}

function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function requireAuth(req: any, res: any, next: any): void {
  const auth = req.headers.authorization as string | undefined;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(auth.slice(7), JWT_SECRET) as { userId: number; email: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// 5 attempts per 15 minutes
router.post("/auth/register", rateLimit(5, 15 * 60 * 1000), async (req, res): Promise<void> => {
  try {
    const { name, email, password, phone, address } = req.body as {
      name: string;
      email: string;
      password: string;
      phone?: string;
      address?: string;
    };

    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email, and password are required" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (existing) {
      res.status(409).json({ error: "An account with this email already exists" });
      return;
    }

    const [user] = await db
      .insert(usersTable)
      .values({
        name,
        email: email.toLowerCase(),
        passwordHash: hashPassword(password),
        phone: phone ?? null,
        address: address ?? null,
      })
      .returning();

    const token = signToken({ userId: user.id, email: user.email });
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Registration failed");
    res.status(500).json({ error: "Registration failed" });
  }
});

// 10 attempts per 15 minutes
router.post("/auth/login", rateLimit(10, 15 * 60 * 1000), async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase())).limit(1);
    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

router.get("/auth/me", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch user");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.patch("/auth/me", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const { name, phone, address, password, newPassword } = req.body as {
      name?: string;
      phone?: string;
      address?: string;
      password?: string;
      newPassword?: string;
    };

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.user.userId)).limit(1);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    if (newPassword) {
      if (!password || user.passwordHash !== hashPassword(password)) {
        res.status(400).json({ error: "Current password is incorrect" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ error: "New password must be at least 6 characters" });
        return;
      }
      updateData.passwordHash = hashPassword(newPassword);
    }

    const [updated] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, req.user.userId))
      .returning();

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;
