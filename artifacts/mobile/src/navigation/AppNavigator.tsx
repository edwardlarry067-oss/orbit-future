import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import PlansScreen from "../screens/PlansScreen";
import DashboardScreen from "../screens/DashboardScreen";
import WalletScreen from "../screens/WalletScreen";
import SupportScreen from "../screens/SupportScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const icon = (emoji: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#000", borderBottomWidth: 1, borderBottomColor: "#1a1a1a" },
          headerTitleStyle: { color: "#fff", fontWeight: "900", fontSize: 14, letterSpacing: 2, textTransform: "uppercase" },
          tabBarStyle: { backgroundColor: "#000", borderTopWidth: 1, borderTopColor: "#1a1a1a", height: 70, paddingBottom: 10 },
          tabBarActiveTintColor: "#00D4FF",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5, textTransform: "uppercase" },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: icon("🏠"), title: "OrbitFuture" }} />
        <Tab.Screen name="Plans" component={PlansScreen} options={{ tabBarIcon: icon("📡"), title: "Service Plans" }} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: icon("📊"), title: "Dashboard" }} />
        <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarIcon: icon("🪙"), title: "Orbit Wallet" }} />
        <Tab.Screen name="Support" component={SupportScreen} options={{ tabBarIcon: icon("💬"), title: "Support" }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: icon("👤"), title: "Profile" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
