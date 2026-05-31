import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from "react-native";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280", green: "#25D366" };

export default function SupportScreen() {
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>Support <Text style={{ color: C.primary }}>Center</Text></Text>
      <Text style={s.subtitle}>We're here 24/7. Choose how to reach us.</Text>

      {/* WhatsApp */}
      <TouchableOpacity
        style={[s.card, { borderColor: C.green + "40" }]}
        onPress={() => Linking.openURL("https://wa.me/16206123994?text=Hi!%20I%20need%20support%20with%20my%20OrbitFuture%20service.")}
      >
        <Text style={s.cardIcon}>💬</Text>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>WhatsApp</Text>
          <Text style={s.cardDesc}>Fastest response — typically under 5 minutes</Text>
          <Text style={[s.cardLink, { color: C.green }]}>+1 (620) 612-3994 →</Text>
        </View>
      </TouchableOpacity>

      {/* Email */}
      <TouchableOpacity
        style={s.card}
        onPress={() => Linking.openURL("mailto:managementstarlinkhq@gmail.com?subject=OrbitFuture%20Support")}
      >
        <Text style={s.cardIcon}>📧</Text>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>Email Support</Text>
          <Text style={s.cardDesc}>Detailed inquiries — reply within 2 hours</Text>
          <Text style={[s.cardLink, { color: C.primary }]}>managementstarlinkhq@gmail.com →</Text>
        </View>
      </TouchableOpacity>

      {/* Hours */}
      <View style={[s.card, { borderColor: C.border }]}>
        <Text style={s.cardIcon}>🕐</Text>
        <View style={s.cardBody}>
          <Text style={s.cardTitle}>Support Hours</Text>
          <Text style={s.cardDesc}>WhatsApp: 24 / 7</Text>
          <Text style={s.cardDesc}>Email: 24 / 7</Text>
          <Text style={s.cardDesc}>Average response: {"<"} 5 minutes</Text>
        </View>
      </View>

      {/* Quick help topics */}
      <Text style={s.section}>Quick Help</Text>
      {[
        { icon: "⚡", topic: "Getting Started", hint: "Setup guides and first-time configuration" },
        { icon: "📡", topic: "Connection Issues", hint: "Troubleshoot speed or connectivity problems" },
        { icon: "💳", topic: "Billing & Payments", hint: "Invoices, refunds, and subscription changes" },
        { icon: "👤", topic: "Account & Dashboard", hint: "Login, profile, and subscription management" },
      ].map(({ icon, topic, hint }) => (
        <View key={topic} style={s.topicRow}>
          <Text style={s.topicIcon}>{icon}</Text>
          <View>
            <Text style={s.topicTitle}>{topic}</Text>
            <Text style={s.topicHint}>{hint}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 20, paddingBottom: 40 },
  title: { color: C.text, fontSize: 28, fontWeight: "900", textTransform: "uppercase", letterSpacing: -1, marginBottom: 4 },
  subtitle: { color: C.muted, fontSize: 13, marginBottom: 24 },
  card: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: "row", gap: 14, marginBottom: 12, alignItems: "flex-start" },
  cardIcon: { fontSize: 28, width: 36, textAlign: "center" },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { color: C.text, fontWeight: "800", fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5 },
  cardDesc: { color: C.muted, fontSize: 12, lineHeight: 18 },
  cardLink: { fontWeight: "700", fontSize: 12, marginTop: 4 },
  section: { color: C.text, fontWeight: "900", fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, marginTop: 8, marginBottom: 12 },
  topicRow: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 14, flexDirection: "row", gap: 12, marginBottom: 8, alignItems: "center" },
  topicIcon: { fontSize: 22 },
  topicTitle: { color: C.text, fontWeight: "700", fontSize: 13 },
  topicHint: { color: C.muted, fontSize: 11, marginTop: 2 },
});
