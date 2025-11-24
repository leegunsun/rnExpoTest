/**
 * Route Groups - 화면 1
 * 파일: app/route-groups-guide/01-basic/(with-groups)/screen1.tsx
 * URL: /route-groups-guide/01-basic/screen1
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WithGroupsScreen1() {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <Text style={styles.icon}>🎯</Text>
          <ThemedText type="title" style={styles.title}>
            Route Groups
          </ThemedText>
          <ThemedText style={styles.subtitle}>화면 1</ThemedText>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.label}>📂 파일 경로:</ThemedText>
          <ThemedText style={styles.path}>
            app/route-groups-guide/01-basic/
            {"\n"}(with-groups)/screen1.tsx
          </ThemedText>

          <ThemedText style={[styles.label, { marginTop: 16 }]}>
            🌐 실제 URL:
          </ThemedText>
          <ThemedText style={styles.url}>{pathname}</ThemedText>

          <View style={[styles.notice, { backgroundColor: "#4ECDC4" }]}>
            <ThemedText style={styles.noticeTextWhite}>
              ✨ "(with-groups)"가 URL에서 제거되었습니다!
            </ThemedText>
          </View>

          <View style={styles.comparison}>
            <ThemedText style={styles.comparisonTitle}>
              📊 URL 비교
            </ThemedText>
            <View style={styles.comparisonRow}>
              <ThemedText style={styles.comparisonLabel}>
                일반 디렉터리:
              </ThemedText>
              <ThemedText style={styles.comparisonValue}>
                /01-basic/without-groups/screen1
              </ThemedText>
            </View>
            <View style={styles.comparisonRow}>
              <ThemedText style={[styles.comparisonLabel, styles.highlight]}>
                Route Groups:
              </ThemedText>
              <ThemedText style={[styles.comparisonValue, styles.highlight]}>
                /01-basic/screen1 ✅
              </ThemedText>
            </View>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: "#4ECDC4" },
            pressed && styles.buttonPressed,
          ]}
          onPress={() =>
            router.push("/route-groups-guide/01-basic/screen2")
          }
        >
          <Text style={styles.buttonText}>화면 2로 이동 →</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            { borderColor: "#4ECDC4" },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: "#4ECDC4" }]}>
            ← 뒤로 가기
          </Text>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  infoBox: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  path: {
    fontSize: 13,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  url: {
    fontSize: 13,
    fontFamily: "monospace",
    opacity: 0.8,
    color: "#4ECDC4",
    fontWeight: "700",
  },
  notice: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  noticeTextWhite: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    color: "#FFFFFF",
  },
  comparison: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(128, 128, 128, 0.2)",
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  comparisonRow: {
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  comparisonValue: {
    fontSize: 12,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  highlight: {
    opacity: 1,
    fontWeight: "700",
    color: "#4ECDC4",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  backButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
