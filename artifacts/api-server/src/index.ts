import app from "./app";
import { logger } from "./lib/logger";
import { db } from "@workspace/db";
import { plansTable } from "@workspace/db";
import { sql } from "drizzle-orm";

// ── Auto-seed plans if table is empty ────────────────────────────────────────
async function seedIfEmpty() {
  try {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(plansTable);
    if (Number(count) > 0) return;

    const PLANS = [
      {
        name: "Starlink Residential",
        category: "residential",
        speed: "25–100 Mbps",
        priceMonthly: "120.00",
        hardwarePrice: "599.00",
        description: "Reliable high-speed internet for homes and apartments. Priority access with no data caps.",
        features: ["Unlimited data", "Priority speeds", "Cancel anytime", "Free shipping", "24/7 support"],
        popular: true,
        active: true,
        localPrices: { NGN: { monthly: 75000, hardware: 498000 } },
      },
      {
        name: "Starlink Best Effort",
        category: "residential",
        speed: "5–50 Mbps",
        priceMonthly: "90.00",
        hardwarePrice: "599.00",
        description: "Budget-friendly option for areas with high Starlink demand. Variable speeds, great for light use.",
        features: ["Unlimited data", "Best-effort speeds", "Cancel anytime", "Free shipping", "24/7 support"],
        popular: false,
        active: true,
        localPrices: { NGN: { monthly: 55000, hardware: 498000 } },
      },
      {
        name: "Starlink Roam",
        category: "roam",
        speed: "5–50 Mbps",
        priceMonthly: "150.00",
        hardwarePrice: "599.00",
        description: "Use Starlink anywhere on land in 100+ countries. Perfect for road trips, RVs, and mobile workers.",
        features: ["Use anywhere on land", "100+ countries", "Pause anytime", "Low priority data", "Cancel anytime"],
        popular: false,
        active: true,
        localPrices: { NGN: { monthly: 95000, hardware: 498000 } },
      },
      {
        name: "Starlink Mobile Priority 50GB",
        category: "roam",
        speed: "40–220 Mbps",
        priceMonthly: "250.00",
        hardwarePrice: "599.00",
        description: "50GB of priority mobile data for heavy mobile users. In-motion use on land and coastal waters.",
        features: ["50GB priority data", "In-motion use", "100+ countries", "High-speed streaming", "Cancel anytime"],
        popular: true,
        active: true,
        localPrices: { NGN: { monthly: 160000, hardware: 498000 } },
      },
      {
        name: "Starlink Mobile Priority 1TB",
        category: "roam",
        speed: "40–220 Mbps",
        priceMonthly: "500.00",
        hardwarePrice: "599.00",
        description: "1TB of priority mobile data for power users and teams. Best for video calls, large file transfers, and heavy use.",
        features: ["1TB priority data", "In-motion use", "100+ countries", "Multiple devices", "Cancel anytime"],
        popular: false,
        active: true,
        localPrices: { NGN: { monthly: 320000, hardware: 498000 } },
      },
      {
        name: "Starlink Maritime 50GB",
        category: "maritime",
        speed: "40–220 Mbps",
        priceMonthly: "250.00",
        hardwarePrice: "2500.00",
        description: "50GB priority maritime data for small vessels. Stay connected at sea with high-speed satellite internet.",
        features: ["50GB priority data", "In-motion at sea", "Global ocean coverage", "Marine-grade hardware", "24/7 support"],
        popular: false,
        active: true,
        localPrices: { NGN: { monthly: 160000, hardware: 1600000 } },
      },
      {
        name: "Starlink Maritime 1TB",
        category: "maritime",
        speed: "100–350 Mbps",
        priceMonthly: "1000.00",
        hardwarePrice: "2500.00",
        description: "1TB priority maritime data for yachts, cargo ships, and offshore operations. Maximum speeds at sea.",
        features: ["1TB priority data", "In-motion at sea", "Global ocean coverage", "Enterprise SLA", "24/7 priority support"],
        popular: true,
        active: true,
        localPrices: { NGN: { monthly: 650000, hardware: 1600000 } },
      },
      {
        name: "Starlink Business",
        category: "business",
        speed: "40–220 Mbps",
        priceMonthly: "140.00",
        hardwarePrice: "2500.00",
        description: "Business-grade priority connectivity for offices, clinics, shops, and small enterprises.",
        features: ["Priority data", "Business-grade hardware", "Multiple users", "Business support", "Cancel anytime"],
        popular: false,
        active: true,
        localPrices: { NGN: { monthly: 90000, hardware: 1600000 } },
      },
      {
        name: "Starlink Priority 6TB",
        category: "business",
        speed: "100–500 Mbps",
        priceMonthly: "1500.00",
        hardwarePrice: "2500.00",
        description: "6TB of high-speed priority data for large enterprises, NGOs, and government agencies requiring maximum throughput.",
        features: ["6TB priority data", "Dedicated bandwidth", "Multi-site management", "24/7 priority support", "SLA guarantee"],
        popular: true,
        active: true,
        localPrices: { NGN: { monthly: 950000, hardware: 1600000 } },
      },
    ];

    await db.insert(plansTable).values(PLANS);
    logger.info({ count: PLANS.length }, "Auto-seeded plans table");
  } catch (err) {
    logger.warn({ err }, "Auto-seed skipped (table may not exist yet)");
  }
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  // Seed plans on first boot if table is empty
  seedIfEmpty();
});
