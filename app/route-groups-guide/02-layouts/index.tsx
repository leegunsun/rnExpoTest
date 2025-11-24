/**
 * 02. Layout 패턴
 * Route Groups + _layout.tsx로 다양한 네비게이션 구성
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LayoutsExampleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.tint }]}>
              ← 가이드 메뉴
            </Text>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            02. Layout 패턴
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Route Groups로 네비게이션 구성
          </ThemedText>
        </View>

        <View style={[styles.explanationBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.explanationTitle}>
            📖 개념
          </ThemedText>
          <ThemedText style={styles.explanationText}>
            Route Groups와 _layout.tsx를 결합하면 다양한 네비게이션 패턴을 만들 수 있습니다.
            {"\n\n"}
            <ThemedText style={styles.bold}>핵심:</ThemedText>
            {"\n"}• (tabs)/ + _layout.tsx → Tab Navigation
            {"\n"}• (stack)/ + _layout.tsx → Stack Navigation
            {"\n"}• URL은 간결하게 유지하면서 레이아웃만 적용
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🧭 Tabs Layout
          </ThemedText>
          <View style={[styles.codeBox, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.codeText}>
              {`app/(tabs)/
├── _layout.tsx      # Tabs.Navigator
├── home.tsx         # URL: /home
└── settings.tsx     # URL: /settings`}
            </ThemedText>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4ECDC4" },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/route-groups-guide/02-layouts/home")}
          >
            <Text style={styles.buttonText}>Tab Navigation 보기 →</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📚 Stack Layout
          </ThemedText>
          <View style={[styles.codeBox, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.codeText}>
              {`app/(stack)/
├── _layout.tsx      # Stack.Navigator
├── index.tsx        # URL: /
└── details.tsx      # URL: /details`}
            </ThemedText>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.tint },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/route-groups-guide/02-layouts/home")}
          >
            <Text style={styles.buttonText}>Tab Navigation 보기 →</Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.takeawaysBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.takeawaysTitle}>
            💡 핵심 포인트
          </ThemedText>
          <ThemedText style={styles.takeawaysText}>
            ✓ Route Groups + _layout.tsx = 네비게이션 패턴{"\n"}
            ✓ URL은 깔끔하게, 레이아웃만 적용{"\n"}
            ✓ 여러 레이아웃을 독립적으로 관리
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  backButton: { marginBottom: 12 },
  backButtonText: { fontSize: 16, fontWeight: "600" },
  title: { marginBottom: 8 },
  subtitle: { fontSize: 16, opacity: 0.7 },
  explanationBox: { marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 12 },
  explanationTitle: { marginBottom: 12 },
  explanationText: { fontSize: 14, lineHeight: 22, opacity: 0.8 },
  bold: { fontWeight: "700" },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 12 },
  codeBox: { padding: 16, borderRadius: 8, marginBottom: 16 },
  codeText: { fontSize: 13, fontFamily: "monospace", opacity: 0.8 },
  button: { padding: 16, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  buttonPressed: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  takeawaysBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  takeawaysTitle: { marginBottom: 12 },
  takeawaysText: { fontSize: 13, lineHeight: 20, opacity: 0.8 },
});
