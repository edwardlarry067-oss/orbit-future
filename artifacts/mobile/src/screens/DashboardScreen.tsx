import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280", green: "#10b981", red: "#ef4444" };

interface Subscription { id: number; planName: string; status: string; startDate: string; endDate: string | null; }

export default function DashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiRequest<Subscription[]>("GET", "subscriptions").catch(() => []),
      apiRequest<{ balance: number }>("GET", "user/token-balance").catch(() => ({ balance: 0 })),
    ]).then(([s, t]) => {
      setSubs(s as Subscription[]);
      setTokenBalance((t as { balance: number }).balance);
    }).finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <View style={s.center}>
      <Text style={s.title}>Sign in to view{"\n"}your dashboard</Text>
      <TouchableOpacity style={s.btn} onPress={() => navigation.navigate("Profile")}>
        <Text style={s.btnText}>SIGN IN</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return (
    <View style={s.center}><ActivityIndicator color={C.primary} size="large" /></View>
  );

  const statusColor = (s: string) => s === "active" ? C.green : s === "pending" ? C.primary : C.red;

  return (
    <ScrollView style={sc.container} contentContainerStyle={sc.content}>
      <Text style={sc.title}>My <Text style={{ color: C.primary }}>Dashboard</Text></Text>
      <Text style={sc.name}>{user.name}</Text>
      <Text style={sc.email}>{user.email}</Text>

      {/* Wallet */}
      <View style={sc.walletCard}>
        <Text style={sc.walletLabel}>🪙 Orbit Wallet Balance</Text>
        <Text style={sc.walletBal}>{tokenBalance?.toLocaleString() ?? "—"} tokens</Text>
        <TouchableOpacity style={sc.topUpBtn} onPress={() => navigation.navigate("Wallet")}>
          <Text style={sc.topUpText}>TOP UP WALLET</Text>
        </TouchableOpacity>
      </View>

      {/* Subscriptions */}
      <Text style={sc.sectionTitle}>Active Subscriptions</Text>
      {subs.length === 0 ? (
        <View style={sc.emptyCard}>
          <Text style={sc.emptyText}>No active subscriptions yet.</Text>
          <TouchableOpacity style={sc.btn} onPress={() => navigation.navigate("Plans")}>
            <Text style={sc.btnText}>VIEW PLANS</Text>
          </TouchableOpacity>
        </View>
      ) : (
        subs.map((sub) => (
          <View key={sub.id} style={sc.subCard}>
            <Text style={sc.subPlan}>{sub.planName}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <View style={[sc.dot, { backgroundColor: statusColor(sub.status) }]} />
              <Text style={[sc.subStatus, { color: statusColor(sub.status) }]}>{sub.status.toUpperCase()}</Text>
            </View>
            <Text style={sc.subDate}>Started: {new Date(sub.startDate).toLocaleDateString()}</Text>
          </View>
        ))
      )}

      <TouchableOpacity style={sc.logoutBtn} onPress={() => { Alert.alert("Sign Out", "Are you sure?", [{ text: "Cancel" }, { text: "Sign Out", style: "destructive", onPress: logout }]); }}>
        <Text style={sc.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", padding: 24, gap: 20 },
  title: { color: C.text, fontSize: 26, fontWeight: "900", textTransform: "uppercase", textAlign: "center", letterSpacing: -0.5 },
  btn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32, alignItems: "center" },
  btnText: { color: "#000", fontWeight: "900", fontSize: 12, letterSpacing: 2 },
});

const sc = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: C.text, fontSize: 28, fontWeight: "900", textTransform: "uppercase", letterSpacing: -1 },
  name: { color: C.text, fontSize: 18, fontWeight: "700", marginTop: 4 },
  email: { color: C.muted, fontSize: 13, marginBottom: 24 },
  walletCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 24, alignItems: "center" },
  walletLabel: { color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  walletBal: { color: C.primary, fontSize: 32, fontWeight: "900", marginBottom: 14 },
  topUpBtn: { backgroundColor: C.primary + "20", borderWidth: 1, borderColor: C.primary + "40", borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24 },
  topUpText: { color: C.primary, fontWeight: "800", fontSize: 11, letterSpacing: 2 },
  sectionTitle: { color: C.text, fontWeight: "900", fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 },
  emptyCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 20, alignItems: "center", gap: 14, marginBottom: 14 },
  emptyText: { color: C.muted, fontSize: 13 },
  btn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 24, alignItems: "center" },
  btnText: { color: "#000", fontWeight: "900", fontSize: 12, letterSpacing: 2 },
  subCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 10, gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  subPlan: { color: C.text, fontWeight: "800", fontSize: 15 },
  subStatus: { fontWeight: "700", fontSize: 11, letterSpacing: 1 },
  subDate: { color: C.muted, fontSize: 12 },
  logoutBtn: { marginTop: 24, alignItems: "center" },
  logoutText: { color: C.muted, fontSize: 13, fontWeight: "600" },
});
