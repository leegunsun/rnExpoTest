/**
 * 01. 기본 개념 - Route Groups vs 일반 디렉터리
 *
 * 핵심 차이점:
 * - without-groups/  → URL에 포함됨
 * - (with-groups)/   → URL에서 제거됨
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BasicConceptScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.tint }]}>
              ← 가이드 메뉴
            </Text>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            01. 기본 개념
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Route Groups vs 일반 디렉터리
          </ThemedText>
        </View>

        {/* Explanation */}
        <View style={[styles.explanationBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.explanationTitle}>
            📖 개념 설명
          </ThemedText>
          <ThemedText style={styles.explanationText}>
            <ThemedText style={styles.bold}>일반 디렉터리 (without-groups)</ThemedText>
            {"\n"}• 디렉터리명이 URL 경로에 포함됩니다
            {"\n"}• 파일: app/without-groups/screen1.tsx
            {"\n"}• URL: /without-groups/screen1
            {"\n\n"}
            <ThemedText style={styles.bold}>Route Groups ((with-groups))</ThemedText>
            {"\n"}• 괄호로 감싼 디렉터리명은 URL에서 제거됩니다
            {"\n"}• 파일: app/(with-groups)/screen1.tsx
            {"\n"}• URL: /screen1
            {"\n\n"}
            <ThemedText style={styles.highlight}>
              ✨ Route Groups는 파일 구조만 조직화하고 URL은 간결하게 유지합니다!
            </ThemedText>
          </ThemedText>
        </View>

        {/* 일반 디렉터리 예제 */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📁 일반 디렉터리 (URL에 포함)
          </ThemedText>
          <View style={[styles.codeBox, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.codeText}>
              {`app/route-groups-guide/01-basic/
├── without-groups/
│   ├── screen1.tsx
│   └── screen2.tsx`}
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.tint },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/route-groups-guide/01-basic/without-groups/screen1")
            }
          >
            <Text style={styles.buttonText}>화면 1로 이동 →</Text>
            <Text style={styles.buttonSubtext}>
              URL: /route-groups-guide/01-basic/without-groups/screen1
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.tint },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/route-groups-guide/01-basic/without-groups/screen2")
            }
          >
            <Text style={styles.buttonText}>화면 2로 이동 →</Text>
            <Text style={styles.buttonSubtext}>
              URL: /route-groups-guide/01-basic/without-groups/screen2
            </Text>
          </Pressable>
        </View>

        {/* Route Groups 예제 */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🎯 Route Groups (URL에서 제거)
          </ThemedText>
          <View style={[styles.codeBox, { backgroundColor: colors.card }]}>
            <ThemedText style={styles.codeText}>
              {`app/route-groups-guide/01-basic/
├── (with-groups)/
│   ├── screen1.tsx
│   └── screen2.tsx`}
            </ThemedText>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4ECDC4" },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/route-groups-guide/01-basic/screen1")
            }
          >
            <Text style={styles.buttonText}>화면 1로 이동 →</Text>
            <Text style={styles.buttonSubtext}>
              URL: /route-groups-guide/01-basic/screen1
            </Text>
          </Pressable>

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
            <Text style={styles.buttonSubtext}>
              URL: /route-groups-guide/01-basic/screen2
            </Text>
          </Pressable>
        </View>

        {/* Key Takeaways */}
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
            ✓ Route Groups는 파일 구조 조직화 도구{"\n"}
            ✓ URL을 간결하게 유지하면서 폴더 정리{"\n"}
            ✓ 괄호 (group-name)만 추가하면 됨{"\n"}
            ✓ Typed Routes와 완벽하게 호환
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  explanationBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  explanationTitle: {
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  bold: {
    fontWeight: "700",
  },
  highlight: {
    fontWeight: "600",
    color: "#4ECDC4",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  codeBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  codeText: {
    fontSize: 13,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonSubtext: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
    fontFamily: "monospace",
  },
  takeawaysBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  takeawaysTitle: {
    marginBottom: 12,
  },
  takeawaysText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
});
