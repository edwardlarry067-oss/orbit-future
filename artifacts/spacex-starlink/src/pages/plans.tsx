import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, ArrowRight, Package, CreditCard, Wifi } from "lucide-react";

type Plan = {
  id: number;
  name: string;
  category: string;
  speed: string;
  priceMonthly: number;
  hardwarePrice?: number;
  features: string[];
  stripePaymentLink?: string | null;
  popular: boolean;
  active: boolean;
  description: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Plans",
  residential: "Residential",
  roam: "Roam & Mobile",
  business: "Business",
  maritime: "Maritime",
  aviation: "Aviation",
};

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [payingPlanId, setPayingPlanId] = useState<number | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => { setPlans(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allCategories = ["all", ...Array.from(new Set(plans.map((p) => p.category)))];
  const filtered = activeCategory === "all" ? plans : plans.filter((p) => p.category === activeCategory);

  const handleGetStarted = async (plan: Plan) => {
    if (plan.stripePaymentLink) {
      window.location.href = plan.stripePaymentLink;
      return;
    }
    navigate(`/checkout?planId=${plan.id}`);
  };

  const handleStripePay = async (plan: Plan) => {
    setPayingPlanId(plan.id);
    try {
      const name = localStorage.getItem("orbit_name") || "";
      const email = localStorage.getItem("orbit_email") || "";
      if (!name || !email) {
        navigate(`/checkout?planId=${plan.id}`);
        setPayingPlanId(null);
        return;
      }
      const res = await fetch("/api/stripe-plan-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, email, name }),
      });
      const data = await res.json();
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        navigate(`/checkout?planId=${plan.id}`);
      }
    } catch {
      navigate(`/checkout?planId=${plan.id}`);
    }
    setPayingPlanId(null);
  };

  const totalCost = (plan: Plan) => {
    const hw = plan.hardwarePrice ?? 0;
    return { monthly: plan.priceMonthly, hardware: hw, firstMonth: plan.priceMonthly + hw };
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6 text-xs font-bold uppercase tracking-widest text-primary">
            <Wifi className="w-3.5 h-3.5" />
            Global Coverage · 100+ Countries
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
            Starlink Plans
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            All prices include hardware and monthly subscription. First-month total shown clearly — no hidden fees.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-black border-primary"
                  : "bg-transparent text-gray-400 border-white/20 hover:border-white/40 hover:text-white"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan) => {
              const cost = totalCost(plan);
              return (
                <div
                  key={plan.id}
                  className={`relative bg-card border rounded-2xl flex flex-col transition-all hover:border-primary/40 hover:shadow-[0_0_40px_rgba(0,212,255,0.06)] ${
                    plan.popular ? "border-primary/40 shadow-[0_0_40px_rgba(0,212,255,0.08)]" : "border-border"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-primary text-black text-[10px] font-black uppercase tracking-widest px-3">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="p-7 pb-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2 capitalize">{plan.category}</p>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                  </div>

                  {/* Pricing block */}
                  <div className="px-7 py-5 border-t border-b border-white/5 bg-white/2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Monthly Service</span>
                      </div>
                      <span className="font-black text-white text-lg">${cost.monthly}<span className="text-gray-500 text-xs font-normal">/mo</span></span>
                    </div>

                    {cost.hardware > 0 && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Hardware Kit</span>
                          <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-1.5 py-0.5 uppercase font-bold">One-time</span>
                        </div>
                        <span className="font-bold text-amber-400">${cost.hardware}</span>
                      </div>
                    )}

                    <div className="border-t border-white/8 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400 uppercase tracking-wider font-bold">First Month Total</span>
                      </div>
                      <span className="font-black text-emerald-400 text-xl">${cost.firstMonth}</span>
                    </div>

                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      {cost.hardware > 0
                        ? `Then $${cost.monthly}/mo. Hardware included on first payment.`
                        : `Billed monthly. Cancel anytime.`}
                    </p>
                  </div>

                  {/* Speed + features */}
                  <div className="px-7 py-5 flex-1">
                    <div className="inline-flex items-center gap-1.5 bg-primary/8 border border-primary/15 rounded-lg px-3 py-1.5 mb-4">
                      <Zap className="w-3 h-3 text-primary" />
                      <span className="text-xs font-bold text-primary">{plan.speed}</span>
                    </div>
                    <div className="space-y-2">
                      {plan.features.slice(0, 5).map((f) => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="text-xs text-gray-400">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="p-5 pt-0">
                    <Button
                      className="w-full font-bold uppercase tracking-widest text-xs h-12"
                      onClick={() => handleGetStarted(plan)}
                      disabled={payingPlanId === plan.id}
                    >
                      {payingPlanId === plan.id ? (
                        <span className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Preparing Checkout…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          Get Started — ${cost.firstMonth}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                    <p className="text-center text-[10px] text-gray-600 mt-2 uppercase tracking-widest">
                      Powered by Stripe · Secure Checkout
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trust bar */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Countries Served", value: "100+" },
              { label: "Active Subscribers", value: "4M+" },
              { label: "Avg Download Speed", value: "200Mbps" },
              { label: "Uptime SLA", value: "99.9%" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-primary mb-1">{s.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
