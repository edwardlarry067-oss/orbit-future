import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280", green: "#25D366" };

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuth();

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      {/* Hero */}
      <View style={s.hero}>
        <Text style={s.badge}>⬤ Now Available Worldwide</Text>
        <Text style={s.heroTitle}>Internet{"\n"}<Text style={s.accent}>Anywhere.</Text></Text>
        <Text style={s.heroSub}>High-speed satellite internet. Starting at $90/mo. No contracts. 15-min setup.</Text>
        <TouchableOpacity style={s.primaryBtn} onPress={() => navigation.navigate("Plans")}>
          <Text style={s.primaryBtnText}>⚡  ORDER STARLINK NOW</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.secondaryBtn} onPress={() => navigation.navigate("Support")}>
          <Text style={s.secondaryBtnText}>CONTACT SUPPORT</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        {[["4M+","Subscribers"],["100+","Countries"],["1Gbps","Max Speed"],["99.9%","Uptime"]].map(([v,l]) => (
          <View key={l} style={s.stat}>
            <Text style={s.statVal}>{v}</Text>
            <Text style={s.statLabel}>{l}</Text>
          </View>
        ))}
      </View>

      {/* Features */}
      <Text style={s.sectionTitle}>Why OrbitFuture?</Text>
      {[
        { icon: "⚡", title: "Ultra-Fast Speeds", desc: "Up to 1 Gbps with low latency for gaming, streaming & calls." },
        { icon: "🌍", title: "Global Coverage", desc: "Available in 100+ countries. Rural, maritime, and aviation." },
        { icon: "🛡️", title: "Always Reliable", desc: "99.9% uptime SLA with redundant satellite coverage." },
      ].map(({ icon, title, desc }) => (
        <View key={title} style={s.featureCard}>
          <Text style={s.featureIcon}>{icon}</Text>
          <View style={s.featureText}>
            <Text style={s.featureTitle}>{title}</Text>
            <Text style={s.featureDesc}>{desc}</Text>
          </View>
        </View>
      ))}

      {/* Trust */}
      <View style={s.trustBar}>
        {["🔒 Secure Payments", "🛡️ SSL Protected", "📞 24/7 Support", "✅ Verified Checkout"].map(t => (
          <Text key={t} style={s.trustItem}>{t}</Text>
        ))}
      </View>

      {/* WhatsApp CTA */}
      <TouchableOpacity style={s.waBtn} onPress={() => Linking.openURL("https://wa.me/16206123994?text=Hi!%20I%27m%20interested%20in%20OrbitFuture.")}>
        <Text style={s.waBtnText}>💬  Chat on WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  hero: { alignItems: "center", paddingVertical: 32 },
  badge: { color: C.primary, fontSize: 11, fontWeight: "800", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 },
  heroTitle: { color: C.text, fontSize: 52, fontWeight: "900", textTransform: "uppercase", textAlign: "center", letterSpacing: -2, lineHeight: 54, marginBottom: 12 },
  accent: { color: C.primary },
  heroSub: { color: C.muted, fontSize: 14, textAlign: "center", lineHeight: 22, marginBottom: 24, paddingHorizontal: 12 },
  primaryBtn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 32, width: "100%", alignItems: "center", marginBottom: 10 },
  primaryBtnText: { color: "#000", fontWeight: "900", fontSize: 13, letterSpacing: 2 },
  secondaryBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 32, width: "100%", alignItems: "center" },
  secondaryBtnText: { color: C.muted, fontWeight: "700", fontSize: 12, letterSpacing: 2 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 28 },
  stat: { alignItems: "center" },
  statVal: { color: C.text, fontSize: 18, fontWeight: "900" },
  statLabel: { color: C.muted, fontSize: 9, textTransform: "uppercase", letterSpacing: 1, marginTop: 2 },
  sectionTitle: { color: C.text, fontSize: 20, fontWeight: "900", textTransform: "uppercase", letterSpacing: -0.5, marginBottom: 14 },
  featureCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: "row", alignItems: "flex-start", gap: 14, marginBottom: 10 },
  featureIcon: { fontSize: 28, width: 40, textAlign: "center" },
  featureText: { flex: 1 },
  featureTitle: { color: C.text, fontWeight: "800", fontSize: 14, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  featureDesc: { color: C.muted, fontSize: 12, lineHeight: 18 },
  trustBar: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 24, marginBottom: 20, justifyContent: "center" },
  trustItem: { color: C.muted, fontSize: 11, fontWeight: "600" },
  waBtn: { backgroundColor: C.green + "20", borderWidth: 1, borderColor: C.green + "40", borderRadius: 12, paddingVertical: 16, alignItems: "center" },
  waBtnText: { color: C.green, fontWeight: "800", fontSize: 14, letterSpacing: 1 },
});
