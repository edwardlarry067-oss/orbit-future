import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from "react-native";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280" };

const BUNDLES = [
  { tokens: 500, price: 50, label: "Starter" },
  { tokens: 1200, price: 100, label: "Standard" },
  { tokens: 2500, price: 180, label: "Pro" },
  { tokens: 5000, price: 320, label: "Enterprise" },
];

export default function WalletScreen() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    apiRequest<{ balance: number }>("GET", "user/token-balance")
      .then((d) => setBalance(d.balance))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleBuy = async (bundle: typeof BUNDLES[0]) => {
    if (!user) { Alert.alert("Sign in required", "Please sign in to buy tokens."); return; }
    setBuying(true);
    try {
      const res = await apiRequest<{ url: string }>("POST", "stripe-token-buy", {
        tokens: bundle.tokens,
        amount: bundle.price,
      });
      if ((res as any).url) Linking.openURL((res as any).url);
    } catch (e: any) {
      Alert.alert("Error", e.message ?? "Could not start purchase.");
    } finally {
      setBuying(false);
    }
  };

  if (!user) return (
    <View style={s.center}>
      <Text style={s.emptyTitle}>Sign in to view{"\n"}your wallet</Text>
    </View>
  );

  if (loading) return (
    <View style={s.center}><ActivityIndicator color={C.primary} size="large" /></View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Orbit <Text style={{ color: C.primary }}>Wallet</Text></Text>
      <View style={s.balCard}>
        <Text style={s.balLabel}>🪙 Current Balance</Text>
        <Text style={s.balVal}>{balance?.toLocaleString() ?? "—"}</Text>
        <Text style={s.balSub}>tokens</Text>
      </View>

      <Text style={s.section}>Buy Token Bundle</Text>
      <Text style={s.sectionSub}>Tokens can be used to activate or renew plans instantly.</Text>
      {BUNDLES.map((bundle) => (
        <View key={bundle.tokens} style={s.bundleCard}>
          <View>
            <Text style={s.bundleLabel}>{bundle.label}</Text>
            <Text style={s.bundleTokens}>{bundle.tokens.toLocaleString()} tokens</Text>
          </View>
          <TouchableOpacity style={s.buyBtn} onPress={() => handleBuy(bundle)} disabled={buying}>
            <Text style={s.buyBtnText}>${bundle.price}</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={s.notice}>
        <Text style={s.noticeText}>🔒 All payments secured by Stripe. Tokens credited instantly after payment.</Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: C.muted, fontSize: 18, textAlign: "center" },
  title: { color: C.text, fontSize: 28, fontWeight: "900", textTransform: "uppercase", letterSpacing: -1, marginBottom: 20 },
  balCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 24, alignItems: "center", marginBottom: 28 },
  balLabel: { color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  balVal: { color: C.primary, fontSize: 52, fontWeight: "900", lineHeight: 56 },
  balSub: { color: C.muted, fontSize: 13 },
  section: { color: C.text, fontWeight: "900", fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  sectionSub: { color: C.muted, fontSize: 12, marginBottom: 16 },
  bundleCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  bundleLabel: { color: C.muted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 },
  bundleTokens: { color: C.text, fontWeight: "800", fontSize: 18 },
  buyBtn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
  buyBtnText: { color: "#000", fontWeight: "900", fontSize: 14 },
  notice: { backgroundColor: "#ffffff08", borderRadius: 12, borderWidth: 1, borderColor: "#ffffff10", padding: 14, marginTop: 8 },
  noticeText: { color: C.muted, fontSize: 11, textAlign: "center", lineHeight: 16 },
});
