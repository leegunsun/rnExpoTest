/**
 * Tabs - Settings Screen
 * URL: /route-groups-guide/02-layouts/settings (tabs가 제거됨!)
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePathname } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsTabScreen() {
  const pathname = usePathname();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>⚙️</Text>
        <ThemedText type="title">설정 화면</ThemedText>
        <ThemedText style={styles.subtitle}>Tab Navigation 예제</ThemedText>

        <View style={styles.infoBox}>
          <ThemedText style={styles.label}>📂 파일 경로:</ThemedText>
          <ThemedText style={styles.path}>
            app/(tabs)/settings.tsx
          </ThemedText>

          <ThemedText style={[styles.label, { marginTop: 16 }]}>
            🌐 실제 URL:
          </ThemedText>
          <ThemedText style={styles.url}>{pathname}</ThemedText>

          <View style={styles.notice}>
            <ThemedText style={styles.noticeText}>
              ✨ (tabs)가 제거되어 /settings로 접근됩니다!
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.instruction}>
          👆 하단 탭을 눌러 다른 화면으로 이동해보세요
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  icon: { fontSize: 64, marginBottom: 20 },
  subtitle: { fontSize: 16, opacity: 0.7, marginTop: 8, marginBottom: 32 },
  infoBox: { width: "100%", padding: 20, borderRadius: 12, backgroundColor: "rgba(78, 205, 196, 0.1)", marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  path: { fontSize: 13, fontFamily: "monospace", opacity: 0.8 },
  url: { fontSize: 13, fontFamily: "monospace", opacity: 0.8, color: "#4ECDC4", fontWeight: "700" },
  notice: { marginTop: 16, padding: 12, borderRadius: 8, backgroundColor: "#4ECDC4" },
  noticeText: { fontSize: 13, fontWeight: "600", textAlign: "center", color: "#FFFFFF" },
  instruction: { fontSize: 14, opacity: 0.7, textAlign: "center" },
});
