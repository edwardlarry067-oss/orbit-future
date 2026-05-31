import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";

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

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/api/plans")
      .then((r) => r.json())
      .then((data) => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ["all", "residential", "roam", "business"];
  const filtered = activeCategory === "all" ? plans : plans.filter((p) => p.category === activeCategory);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tighter text-white mb-4">
            Starlink Plans
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the plan that fits your lifestyle — residential, on-the-move, or enterprise-grade.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-gray-400 border-white/20 hover:border-white/40"
              }`}
            >
              {cat === "all" ? "All Plans" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-card border rounded-2xl p-8 flex flex-col transition-all hover:border-primary/40 ${
                  plan.popular ? "border-primary/40 shadow-[0_0_40px_rgba(0,212,255,0.08)]" : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-primary-foreground text-[10px] uppercase tracking-widest px-3">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{plan.category}</p>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${plan.priceMonthly}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{plan.speed}</p>
                  {plan.hardwarePrice && (
                    <p className="text-xs text-gray-600 mt-0.5">+${plan.hardwarePrice} hardware (one-time)</p>
                  )}
                </div>

                <div className="space-y-2 flex-1 mb-6">
                  {plan.features.slice(0, 4).map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm text-gray-400">{f}</span>
                    </div>
                  ))}
                </div>

                {plan.stripePaymentLink ? (
                  <a href={plan.stripePaymentLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full font-bold uppercase tracking-widest text-sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                ) : (
                  <Link href={`/checkout?planId=${plan.id}`}>
                    <Button className="w-full font-bold uppercase tracking-widest text-sm">
                      <Zap className="w-4 h-4 mr-2" />
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
