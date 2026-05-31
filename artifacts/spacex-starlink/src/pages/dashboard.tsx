import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Satellite, Coins, Activity, LogOut, Settings } from "lucide-react";
import { format } from "date-fns";

type Subscription = {
  id: number;
  planName: string;
  planCategory: string;
  planSpeed: string;
  priceMonthly: number;
  status: string;
  createdAt: string;
};

export default function Dashboard() {
  const { user, token, logout, loading } = useAuth();
  const [, navigate] = useLocation();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);
  const [subsLoading, setSubsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/login?redirect=/dashboard");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/subscriptions?email=${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSubscriptions(data.subscriptions || []);
        setSubsLoading(false);
      })
      .catch(() => setSubsLoading(false));

    fetch(`/api/wallet/${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then(setWallet)
      .catch(() => {});
  }, [user, token]);

  if (loading || !user) return null;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
              My Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Welcome back, {user.name}</p>
          </div>
          <Button variant="outline" onClick={logout} className="border-white/20 text-gray-400 hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <span className="text-3xl font-black text-white">{wallet?.balance ?? 0}</span>
                <span className="text-gray-500 text-sm">tokens</span>
              </div>
              <a href="/wallet" className="text-xs text-primary hover:underline mt-2 block font-bold">
                Top up wallet →
              </a>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Active Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="text-3xl font-black text-white">
                  {subscriptions.filter((s) => s.status === "active").length}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-white truncate">{user.email}</p>
              {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border/50">
            <CardTitle className="text-sm uppercase tracking-widest font-bold">My Subscriptions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {subsLoading ? (
              <div className="p-8 text-center text-gray-500">Loading subscriptions...</div>
            ) : subscriptions.length === 0 ? (
              <div className="p-8 text-center">
                <Satellite className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No subscriptions yet.</p>
                <a href="/plans">
                  <Button className="uppercase tracking-widest font-bold text-xs">Browse Plans</Button>
                </a>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white">{sub.planName}</h3>
                      <p className="text-xs text-gray-500 capitalize">{sub.planCategory} · {sub.planSpeed}</p>
                      <p className="text-xs text-gray-600 mt-1">Since {format(new Date(sub.createdAt), "MMM d, yyyy")}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-white">${sub.priceMonthly}/mo</div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase tracking-wider mt-1 ${
                          sub.status === "active"
                            ? "text-emerald-400 border-emerald-400/30"
                            : "text-red-400 border-red-400/30"
                        }`}
                      >
                        {sub.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
