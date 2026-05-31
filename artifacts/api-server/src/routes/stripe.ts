import { Router } from "express";
import Stripe from "stripe";
import { db } from "@workspace/db";
import { subscriptionsTable, plansTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const getStripe = () => new Stripe(process.env["STRIPE_SECRET_KEY"] ?? "", { apiVersion: "2025-04-30.basil" });

const APP_URL = process.env["APP_URL"] ?? "https://www.spacexstarlink.com";

const PLAN_PRICES: Record<number, { name: string; priceMonthly: number; speed: string }> = {
  1: { name: "Starlink Best Effort", priceMonthly: 90, speed: "5–100 Mbps" },
  2: { name: "Starlink Standard", priceMonthly: 120, speed: "50–250 Mbps" },
  3: { name: "Starlink Standard Plus", priceMonthly: 150, speed: "100–300 Mbps" },
  4: { name: "Starlink Roam", priceMonthly: 150, speed: "50–200 Mbps" },
  5: { name: "Starlink Maritime", priceMonthly: 250, speed: "100–350 Mbps" },
  6: { name: "Starlink Aviation", priceMonthly: 500, speed: "100–350 Mbps" },
  7: { name: "Starlink Business", priceMonthly: 500, speed: "200–500 Mbps" },
  8: { name: "Starlink Enterprise", priceMonthly: 1500, speed: "500 Mbps–1 Gbps" },
  9: { name: "Starlink Global Elite", priceMonthly: 3000, speed: "1 Gbps+" },
};

// POST /api/stripe-plan-pay
router.post("/stripe-plan-pay", async (req, res): Promise<void> => {
  try {
    const { planId, email, name, address } = req.body as {
      planId: number;
      email: string;
      name: string;
      address?: string;
    };

    if (!planId || !email?.trim() || !name?.trim()) {
      res.status(400).json({ error: "planId, email, and name are required" });
      return;
    }

    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    if (!stripeKey) {
      res.status(503).json({ error: "Payment gateway not configured. Please contact support." });
      return;
    }

    let planName: string;
    let priceMonthly: number;
    let planSpeed: string;

    try {
      const [dbPlan] = await db.select().from(plansTable).where(eq(plansTable.id, planId)).limit(1);
      if (dbPlan) {
        planName = dbPlan.name;
        priceMonthly = parseFloat(String(dbPlan.priceMonthly));
        planSpeed = dbPlan.speed;
      } else {
        throw new Error("not in db");
      }
    } catch {
      const fallback = PLAN_PRICES[planId];
      if (!fallback) { res.status(404).json({ error: "Plan not found" }); return; }
      planName = fallback.name;
      priceMonthly = fallback.priceMonthly;
      planSpeed = fallback.speed;
    }

    const stripe = getStripe();

    const safeEmail = encodeURIComponent(email.trim());
    const safeName = encodeURIComponent(name.trim());
    const safeAddr = encodeURIComponent(address?.trim() ?? "");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email.trim(),
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: `${planSpeed} · $${priceMonthly}/month`,
            },
            unit_amount: Math.round(priceMonthly * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId: String(planId),
        planName,
        planSpeed,
        customerName: name.trim(),
        customerEmail: email.trim(),
        address: address?.trim() ?? "",
      },
      success_url: `${APP_URL}/plans?stripe_success=1&plan_id=${planId}&email=${safeEmail}&name=${safeName}&address=${safeAddr}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/plans?stripe_cancel=1`,
    });

    res.json({ paymentLink: session.url, sessionId: session.id });
  } catch (err) {
    req.log?.error?.({ err }, "stripe-plan-pay error");
    res.status(500).json({ error: "Failed to generate payment link" });
  }
});

// POST /api/stripe-plan-verify
router.post("/stripe-plan-verify", async (req, res): Promise<void> => {
  try {
    const { session_id, plan_id, email, name, address } = req.body as {
      session_id: string;
      plan_id?: string;
      email?: string;
      name?: string;
      address?: string;
    };

    if (!session_id) {
      res.status(400).json({ error: "session_id is required" });
      return;
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      res.status(400).json({ error: "Payment not completed", status: session.payment_status });
      return;
    }

    const meta = session.metadata ?? {};
    const planIdNum = parseInt(plan_id ?? meta.planId ?? "0") || 0;
    const customerEmail = email ?? meta.customerEmail ?? session.customer_email ?? "";
    const customerName = name ?? meta.customerName ?? "";
    const customerAddress = address ?? meta.address ?? "";
    const planName = meta.planName ?? PLAN_PRICES[planIdNum]?.name ?? "Starlink Plan";
    const planSpeed = meta.planSpeed ?? PLAN_PRICES[planIdNum]?.speed ?? "";
    const amountPaid = (session.amount_total ?? 0) / 100;

    let subscriptionId: number | null = null;
    try {
      const [sub] = await db
        .insert(subscriptionsTable)
        .values({
          email: customerEmail,
          name: customerName,
          planId: planIdNum,
          status: "active",
          address: customerAddress,
          amountPaid: String(amountPaid),
          stripeSubscriptionId: session.payment_intent as string ?? session_id,
        })
        .returning();
      subscriptionId = sub?.id ?? null;
    } catch {
      // DB unavailable — still return success
    }

    res.json({
      success: true,
      subscription: {
        id: subscriptionId,
        planName,
        planSpeed,
        email: customerEmail,
        amountPaid,
        currency: session.currency?.toUpperCase() ?? "USD",
        sessionId: session_id,
        address: customerAddress,
      },
    });
  } catch (err) {
    req.log?.error?.({ err }, "stripe-plan-verify error");
    res.status(500).json({ error: "Verification failed" });
  }
});

// POST /api/stripe-webhook
router.post("/stripe-webhook", async (req, res): Promise<void> => {
  res.sendStatus(200);

  try {
    const webhookSecret = process.env["STRIPE_WEBHOOK_SECRET"];
    let event: Stripe.Event;

    if (webhookSecret) {
      const sig = req.headers["stripe-signature"] as string;
      const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
      try {
        event = getStripe().webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch {
        req.log?.warn("Stripe webhook signature verification failed");
        return;
      }
    } else {
      event = req.body as Stripe.Event;
    }

    if (event.type !== "checkout.session.completed") return;

    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return;

    const meta = session.metadata ?? {};
    const planIdNum = parseInt(meta.planId ?? "0") || 0;
    const customerEmail = meta.customerEmail ?? session.customer_email ?? "";
    const customerName = meta.customerName ?? "";
    const amountPaid = (session.amount_total ?? 0) / 100;

    try {
      await db.insert(subscriptionsTable).values({
        email: customerEmail,
        name: customerName,
        planId: planIdNum,
        status: "active",
        address: meta.address ?? "",
        amountPaid: String(amountPaid),
        stripeSubscriptionId: session.payment_intent as string ?? session.id,
      });
    } catch {
      // Already inserted via verify endpoint or DB unavailable
    }
  } catch (err) {
    req.log?.error?.({ err }, "Stripe webhook processing error");
  }
});

export default router;
