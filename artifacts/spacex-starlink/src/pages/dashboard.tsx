import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Satellite, Coins, Activity, LogOut, Settings, Package,
  Truck, Wrench, CheckCircle2, Zap, Calendar, ArrowRight,
  Clock, AlertCircle, ExternalLink, HeadphonesIcon
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";

type Subscription = {
  id: number;
  planName: string;
  planCategory: string;
  planSpeed: string;
  priceMonthly: number;
  status: string;
  createdAt: string;
  cancelledAt?: string;
};

type InstallStep = {
  id: number;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  activeColor: string;
};

const INSTALL_STEPS: InstallStep[] = [
  {
    id: 1,
    label: "Order Received",
    description: "Your order has been confirmed and entered our system.",
    icon: CheckCircle2,
    activeColor: "text-emerald-400",
  },
  {
    id: 2,
    label: "Processing",
    description: "Hardware is being prepared and configured for your plan.",
    icon: Wrench,
    activeColor: "text-amber-400",
  },
  {
    id: 3,
    label: "Dispatched",
    description: "Your kit is on its way. Expect delivery within 3–5 business days.",
    icon: Truck,
    activeColor: "text-blue-400",
  },
  {
    id: 4,
    label: "Delivered",
    description: "Hardware delivered! Time to set up your dish.",
    icon: Package,
    activeColor: "text-purple-400",
  },
  {
    id: 5,
    label: "Active & Online",
    description: "You're fully connected to the ORBITFUTURE network.",
    icon: Zap,
    activeColor: "text-primary",
  },
];

function getInstallStepFromStatus(status: string, daysOld: number): number {
  if (status === "cancelled") return 0;
  if (status === "active") {
    if (daysOld < 1) return 1;
    if (daysOld < 2) return 2;
    if (daysOld < 5) return 3;
    if (daysOld < 8) return 4;
    return 5;
  }
  return 1;
}

function InstallationTracker({ subscription }: { subscription: Subscription }) {
  const daysOld = Math.floor(
    (Date.now() - new Date(subscription.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentStep = getInstallStepFromStatus(subscription.status, daysOld);

  if (subscription.status === "cancelled") return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-4">
      <div className="flex items-center gap-2 mb-5">
        <Satellite className="w-4 h-4 text-primary" />
        <span className="text-xs font-bold uppercase tracking-widest text-primary">Installation Tracker</span>
        <span className="ml-auto text-xs text-gray-600 uppercase tracking-wider font-bold">{subscription.planName}</span>
      </div>

      {/* Desktop: horizontal stepper */}
      <div className="hidden md:flex items-start gap-0">
        {INSTALL_STEPS.map((step, idx) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-3 transition-all ${
                  isCompleted
                    ? "bg-emerald-400/20 border-emerald-400"
                    : isActive
                    ? "bg-primary/20 border-primary shadow-[0_0_16px_rgba(0,212,255,0.3)]"
                    : "bg-white/3 border-white/15"
                }`}>
                  {isCompleted
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    : <Icon className={`w-5 h-5 ${isActive ? step.activeColor : "text-gray-600"}`} />
                  }
                </div>
                <p className={`text-[10px] font-bold uppercase tracking-widest text-center ${
                  isCompleted ? "text-emerald-400" : isActive ? "text-white" : "text-gray-600"
                }`}>{step.label}</p>
                {isActive && (
                  <p className="text-[10px] text-gray-500 text-center mt-1 max-w-[100px] leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
              {idx < INSTALL_STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 mt-5 mx-1 rounded-full transition-all ${
                  currentStep > step.id ? "bg-emerald-400/50" : "bg-white/8"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: vertical stepper */}
      <div className="md:hidden space-y-4">
        {INSTALL_STEPS.map((step) => {
          const isCompleted = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className={`flex items-start gap-3 rounded-xl p-3 transition-all ${
              isActive ? "bg-primary/5 border border-primary/20" : "opacity-50"
            }`}>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${
                isCompleted
                  ? "bg-emerald-400/20 border-emerald-400"
                  : isActive
                  ? "bg-primary/20 border-primary"
                  : "bg-white/3 border-white/10"
              }`}>
                {isCompleted
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <Icon className={`w-4 h-4 ${isActive ? step.activeColor : "text-gray-600"}`} />
                }
              </div>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${
                  isCompleted ? "text-emerald-400" : isActive ? "text-white" : "text-gray-600"
                }`}>{step.label}</p>
                {isActive && <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {currentStep === 5 && (
        <div className="mt-4 flex items-center gap-2 bg-emerald-400/8 border border-emerald-400/20 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-400 font-bold">You're fully connected to ORBITFUTURE. Enjoy high-speed internet anywhere!</p>
        </div>
      )}

      {currentStep < 5 && (
        <div className="mt-4 flex items-center gap-2 text-gray-600 text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>Questions about delivery? Contact our team via WhatsApp or email support.</span>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, token, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [subsLoading, setSubsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<number | null>(null);
  const [cancelledIds, setCancelledIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!loading && !user) navigate("/login?redirect=/dashboard");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/subscriptions?email=${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setSubscriptions(data.subscriptions || []); setSubsLoading(false); })
      .catch(() => setSubsLoading(false));

    fetch(`/api/wallet/${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then(setWallet)
      .catch(() => {});
  }, [user, token]);

  const handleCancel = async (id: number) => {
    if (!token) return;
    const confirmed = window.confirm("Are you sure you want to cancel this subscription? You'll retain access until end of billing period.");
    if (!confirmed) return;
    setCancelling(id);
    try {
      const res = await fetch(`/api/subscriptions/${id}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCancelledIds(prev => new Set([...prev, id]));
        setSubscriptions(prev =>
          prev.map(s => s.id === id ? { ...s, status: "cancelled" } : s)
        );
      }
    } catch {}
    setCancelling(null);
  };

  if (loading || !user) return null;

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const totalMonthly = activeSubs.reduce((acc, s) => acc + s.priceMonthly, 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
              My Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Welcome back, <span className="text-white font-bold">{user.name}</span></p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/support">
              <Button variant="outline" size="sm" className="border-white/15 text-gray-400 hover:text-white text-xs uppercase tracking-widest hidden sm:flex">
                <HeadphonesIcon className="w-3.5 h-3.5 mr-1.5" />
                Support
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout} className="border-white/15 text-gray-400 hover:text-white text-xs uppercase tracking-widest">
              <LogOut className="w-3.5 h-3.5 mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Orbit Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-3xl font-black text-white">{wallet?.balance ?? 0}</span>
                <span className="text-gray-500 text-sm">tokens</span>
              </div>
              <Link href="/wallet">
                <span className="text-xs text-primary hover:underline mt-2 block font-bold cursor-pointer">
                  Top up wallet →
                </span>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Active Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="text-3xl font-black text-white">{activeSubs.length}</span>
              </div>
              {activeSubs.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">${totalMonthly}/mo total</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              {user.phone && <p className="text-xs text-gray-500 mt-1">{user.phone}</p>}
              {user.address && <p className="text-xs text-gray-600 truncate mt-0.5">{user.address}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Installation trackers — one per active subscription */}
        {!subsLoading && activeSubs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Delivery & Installation Status</h2>
            {activeSubs.map((sub) => (
              <InstallationTracker key={sub.id} subscription={sub} />
            ))}
          </div>
        )}

        {/* Subscriptions list */}
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border/50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm uppercase tracking-widest font-bold">My Subscriptions</CardTitle>
            {activeSubs.length === 0 && !subsLoading && (
              <Link href="/plans">
                <Button size="sm" className="text-xs uppercase tracking-widest font-bold h-8">
                  <ArrowRight className="w-3.5 h-3.5 mr-1.5" />
                  Browse Plans
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {subsLoading ? (
              <div className="p-8 text-center">
                <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 text-xs mt-3">Loading subscriptions...</p>
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="p-10 text-center">
                <Satellite className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-500 mb-2 font-bold">No subscriptions yet</p>
                <p className="text-gray-600 text-xs mb-6">Get connected with a Starlink plan starting at $90/mo</p>
                <Link href="/plans">
                  <Button className="uppercase tracking-widest font-bold text-xs h-10">
                    <Satellite className="w-4 h-4 mr-2" />
                    Browse Plans
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white text-sm">{sub.planName}</h3>
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase tracking-wider ${
                            sub.status === "active"
                              ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/5"
                              : sub.status === "cancelled"
                              ? "text-red-400 border-red-400/30 bg-red-400/5"
                              : "text-gray-400 border-gray-400/30"
                          }`}
                        >
                          {sub.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 capitalize">{sub.planCategory} · {sub.planSpeed}</p>
                      <p className="text-xs text-gray-700 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Started {format(new Date(sub.createdAt), "MMM d, yyyy")}
                        {sub.cancelledAt && ` · Cancelled ${format(new Date(sub.cancelledAt), "MMM d, yyyy")}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-black text-white">${sub.priceMonthly}<span className="text-xs text-gray-500 font-normal">/mo</span></div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">Ref: #ORB-{String(sub.id).padStart(6, "0")}</p>
                      </div>
                      {sub.status === "active" && !cancelledIds.has(sub.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(sub.id)}
                          disabled={cancelling === sub.id}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 text-xs uppercase tracking-widest font-bold h-8 shrink-0"
                        >
                          {cancelling === sub.id ? (
                            <span className="w-3.5 h-3.5 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          ) : "Cancel"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Support nudge */}
        {subscriptions.length > 0 && (
          <div className="mt-6 border border-white/6 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">
                Questions about your plan or delivery? Our support team is available 24/7.
              </p>
            </div>
            <Link href="/support">
              <Button variant="outline" size="sm" className="border-white/15 text-xs uppercase tracking-widest font-bold h-7 shrink-0">
                <ExternalLink className="w-3 h-3 mr-1" />
                Support
              </Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
