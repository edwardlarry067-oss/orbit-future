import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import LoginScreen from "./LoginScreen";

const C = { bg: "#000", card: "#0d0d0d", border: "#1a1a1a", primary: "#00D4FF", text: "#fff", muted: "#6b7280", red: "#ef4444" };

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, loading } = useAuth();

  if (loading) return (
    <View style={s.center}><ActivityIndicator color={C.primary} size="large" /></View>
  );

  if (!user) return <LoginScreen navigation={navigation} />;

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <Text style={s.title}>My <Text style={{ color: C.primary }}>Profile</Text></Text>

      <View style={s.avatar}>
        <Text style={s.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
      </View>

      <Text style={s.name}>{user.name}</Text>
      <Text style={s.email}>{user.email}</Text>

      {[
        { label: "Name", value: user.name },
        { label: "Email", value: user.email },
        { label: "Account Status", value: "Active" },
      ].map(({ label, value }) => (
        <View key={label} style={s.row}>
          <Text style={s.rowLabel}>{label}</Text>
          <Text style={s.rowValue}>{value}</Text>
        </View>
      ))}

      <TouchableOpacity style={s.logoutBtn} onPress={() => {
        Alert.alert("Sign Out", "Are you sure?", [
          { text: "Cancel" },
          { text: "Sign Out", style: "destructive", onPress: logout },
        ]);
      }}>
        <Text style={s.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  content: { padding: 24, paddingBottom: 48, alignItems: "center" },
  center: { flex: 1, backgroundColor: C.bg, alignItems: "center", justifyContent: "center" },
  title: { color: C.text, fontSize: 28, fontWeight: "900", textTransform: "uppercase", letterSpacing: -1, marginBottom: 24, alignSelf: "flex-start" },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: C.primary + "20", borderWidth: 2, borderColor: C.primary + "40", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  avatarText: { color: C.primary, fontSize: 32, fontWeight: "900" },
  name: { color: C.text, fontSize: 22, fontWeight: "800", marginBottom: 4 },
  email: { color: C.muted, fontSize: 13, marginBottom: 28 },
  row: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 16, flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 8 },
  rowLabel: { color: C.muted, fontSize: 12, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  rowValue: { color: C.text, fontSize: 13, fontWeight: "600" },
  logoutBtn: { marginTop: 32, borderWidth: 1, borderColor: C.red + "40", borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40, backgroundColor: C.red + "10" },
  logoutText: { color: C.red, fontWeight: "700", fontSize: 13, letterSpacing: 1 },
});
