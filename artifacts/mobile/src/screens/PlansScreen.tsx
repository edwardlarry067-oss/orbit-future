import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Alert } from "react-native";
import { apiRequest } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280" };

interface Plan {
  id: number;
  name: string;
  description: string;
  priceMonthly: string;
  hardwarePrice: string;
  speedMbps: number;
  features: string[] | null;
}

export default function PlansScreen({ navigation }: any) {
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<Plan[]>("GET", "plans")
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOrder = (plan: Plan) => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to place an order.", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => navigation.navigate("Profile") },
      ]);
      return;
    }
    const msg = encodeURIComponent(
      `Hi! I'd like to order the ${plan.name} plan ($${plan.priceMonthly}/mo + $${plan.hardwarePrice} hardware).`
    );
    Linking.openURL(`https://wa.me/16206123994?text=${msg}`);
  };

  if (loading) return (
    <View style={s.center}><ActivityIndicator color={C.primary} size="large" /></View>
  );

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Service <Text style={{ color: C.primary }}>Plans</Text></Text>
      <Text style={s.subtitle}>No contracts. Cancel anytime.</Text>
      {plans.map((plan) => {
        const monthly = parseFloat(plan.priceMonthly);
        const hw = parseFloat(plan.hardwarePrice);
        const features: string[] = Array.isArray(plan.features) ? plan.features : [];
        return (
          <View key={plan.id} style={s.card}>
            <Text style={s.planName}>{plan.name}</Text>
            <Text style={s.planDesc}>{plan.description}</Text>
            <View style={s.priceRow}>
              <Text style={s.price}>${monthly}<Text style={s.priceSub}>/mo</Text></Text>
              {hw > 0 && <Text style={s.hw}>+ ${hw} hardware</Text>}
            </View>
            {plan.speedMbps > 0 && (
              <Text style={s.speed}>⚡ Up to {plan.speedMbps >= 1000 ? `${plan.speedMbps / 1000} Gbps` : `${plan.speedMbps} Mbps`}</Text>
            )}
            {features.slice(0, 4).map((f) => (
              <Text key={f} style={s.feature}>✓  {f}</Text>
            ))}
            <TouchableOpacity style={s.btn} onPress={() => handleOrder(plan)}>
              <Text style={s.btnText}>ORDER THIS PLAN</Text>
            </TouchableOpacity>
          </View>
        );
      })}
      {plans.length === 0 && (
        <Text style={s.empty}>No plans available right now. Check back soon.</Text>
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  title: { color: C.text, fontSize: 32, fontWeight: "900", textTransform: "uppercase", letterSpacing: -1, marginBottom: 4 },
  subtitle: { color: C.muted, fontSize: 12, marginBottom: 24, textTransform: "uppercase", letterSpacing: 1 },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 16 },
  planName: { color: C.text, fontWeight: "900", fontSize: 18, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 },
  planDesc: { color: C.muted, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8, marginBottom: 8 },
  price: { color: C.primary, fontSize: 34, fontWeight: "900" },
  priceSub: { color: C.muted, fontSize: 14, fontWeight: "400" },
  hw: { color: C.muted, fontSize: 12 },
  speed: { color: C.primary, fontSize: 12, fontWeight: "700", marginBottom: 10 },
  feature: { color: C.muted, fontSize: 13, paddingVertical: 2 },
  btn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 15, alignItems: "center", marginTop: 16 },
  btnText: { color: "#000", fontWeight: "900", fontSize: 13, letterSpacing: 2 },
  empty: { color: C.muted, textAlign: "center", marginTop: 40, fontSize: 14 },
});
