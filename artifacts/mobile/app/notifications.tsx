import { useRouter } from "expo-router";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import NotificationsScreen from "../src/screens/NotificationsScreen";
import { Colors } from "../src/theme";

export default function NotificationsRoute() {
  const router = useRouter();
  return (
    <View style={s.container}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backText}>← Back</Text>
        </TouchableOpacity>
      </View>
      <NotificationsScreen navigation={{ navigate: () => {}, goBack: () => router.back() }} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" },
  backBtn: { paddingVertical: 8 },
  backText: { color: Colors.primary, fontSize: 14, fontWeight: "700" },
});
