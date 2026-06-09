import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Ship, Briefcase, Plane, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";

type Plan = {
  id: number;
  name: string;
  category: string;
  priceMonthly: number;
  hardwarePrice?: number;
  localPrices?: Record<string, { monthly: number; hardware?: number }>;
  description: string;
  popular: boolean;
};

type Option = {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
};

const USE_CASE_OPTIONS: Option[] = [
  { id: "residential", label: "Home Internet", sublabel: "Fixed home, house, or apartment", icon: Home },
  { id: "roam", label: "Travel & Mobile Use", sublabel: "RV, van, camping, overland travel", icon: MapPin },
  { id: "business", label: "Business or Teams", sublabel: "Office, remote site, or enterprise", icon: Briefcase },
  { id: "maritime", label: "Maritime / Vessels", sublabel: "Boats, yachts, cargo ships", icon: Ship },
  { id: "aviation", label: "Aviation", sublabel: "Commercial or private aircraft", icon: Plane },
];

type Props = {
  plans: Plan[];
  onSelectPlan: (planId: number) => void;
};

export function PlanFinder({ plans, onSelectPlan }: Props) {
  const { formatPrice, formatMonthly, currency, symbol } = useCurrency();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<Plan | null>(null);

  const handleReset = () => {
    setSelected(null);
    setResult(null);
  };

  const handleClose = (v: boolean) => {
    setOpen(v);
    if (!v) handleReset();
  };

  const handleSelect = (categoryId: string) => {
    setSelected(categoryId);
    if (categoryId === "aviation") {
      setResult(null);
      return;
    }
    const popular = plans.find((p) => p.category === categoryId && p.popular);
    const any = plans.find((p) => p.category === categoryId);
    setResult(popular ?? any ?? null);
  };

  const handleChoose = () => {
    if (!result) return;
    onSelectPlan(result.id);
    setOpen(false);
    handleReset();
  };

  const getLocalTotal = (plan: Plan) => {
    const lp = plan.localPrices?.[currency];
    if (lp && currency !== "USD") {
      const total = lp.monthly + (lp.hardware ?? 0);
      return `${symbol}${Math.round(total).toLocaleString()}`;
    }
    return formatPrice(plan.priceMonthly + (plan.hardwarePrice ?? 0));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-5 text-xs font-bold uppercase tracking-widest border-white/20 hover:border-primary/40 hover:text-primary transition-all"
          aria-label="Help me choose a plan"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-primary" />
          Help Me Choose
        </Button>
      </DialogTrigger>

      <DialogContent
        className="bg-[#0a0a0a] border-white/10 max-w-md"
        aria-describedby="plan-finder-desc"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-tighter text-white">
            Find Your Perfect Plan
          </DialogTitle>
          <p id="plan-finder-desc" className="text-sm text-gray-400 mt-1">
            Tell us how you'll use Starlink and we'll match you with the right plan.
          </p>
        </DialogHeader>

        <fieldset className="space-y-2 mt-2 border-none p-0 m-0">
          <legend className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
            What will you primarily use it for?
          </legend>
          {USE_CASE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                aria-pressed={isSelected}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? "border-primary/50 bg-primary/8"
                    : "border-white/8 bg-white/2 hover:border-white/20 hover:bg-white/4"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? "bg-primary/20 border-primary/30"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-snug ${isSelected ? "text-white" : "text-gray-200"}`}>
                    {opt.label}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{opt.sublabel}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </fieldset>

        {/* Aviation — no pricing, contact sales */}
        {selected === "aviation" && (
          <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-sm font-bold text-white mb-1.5">Aviation Connectivity</p>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
              Aviation plans require custom hardware configuration and pricing based on aircraft type, routes, and data requirements. Contact our enterprise sales team for a bespoke quote.
            </p>
            <a
              href="mailto:sales@orbitfuture.com?subject=Aviation%20Connectivity%20Enquiry"
              onClick={() => setOpen(false)}
            >
              <Button size="sm" className="text-xs font-bold uppercase tracking-widest w-full h-10">
                <ArrowRight className="w-4 h-4 mr-2" />
                Contact Enterprise Sales
              </Button>
            </a>
          </div>
        )}

        {/* Matched plan result */}
        {result && selected && selected !== "aviation" && (
          <div className="mt-4 p-5 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-widest text-black bg-primary rounded-full px-2.5 py-1">
                ✦ Best Match
              </span>
              {result.popular && (
                <span className="text-[9px] font-black uppercase tracking-widest text-primary border border-primary/30 rounded-full px-2.5 py-1">
                  Most Popular
                </span>
              )}
            </div>
            <p className="text-lg font-bold text-white leading-tight">{result.name}</p>
            <p className="text-xs text-gray-400 mt-1 mb-3 leading-relaxed">{result.description}</p>

            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-black text-primary">{formatMonthly(result.priceMonthly, result.localPrices)}</span>
            </div>
            {(result.hardwarePrice ?? 0) > 0 && (
              <p className="text-[11px] text-gray-500 mb-3">
                + {formatPrice(result.hardwarePrice ?? 0, result.localPrices, "hardware")} hardware (one-time) · First payment: {getLocalTotal(result)}
              </p>
            )}

            <Button
              onClick={handleChoose}
              className="w-full h-11 text-xs font-bold uppercase tracking-widest mt-1"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Order {result.name}
            </Button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-[11px] text-gray-600 hover:text-gray-400 mt-2 transition-colors"
            >
              ← Change selection
            </button>
          </div>
        )}

        <p className="text-[10px] text-gray-700 leading-relaxed text-center mt-1">
          OrbitFuture is an independent Starlink solutions provider. Not affiliated with SpaceX.
        </p>
      </DialogContent>
    </Dialog>
  );
}
