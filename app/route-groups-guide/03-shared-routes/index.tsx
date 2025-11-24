/**
 * 03. Shared Routes - 배열 문법으로 화면 공유
 *
 * Route Groups의 핵심 기능!
 * (home,search)/ 디렉터리는 두 개의 경로를 동시에 생성합니다.
 *
 * 파일: app/(home,search)/[user].tsx
 * 생성되는 경로:
 * - /(home)/[user]
 * - /(search)/[user]
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SharedRoutesScreen() {
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
            03. Shared Routes
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            배열 문법으로 화면 공유하기
          </ThemedText>
        </View>

        <View style={[styles.explanationBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.explanationTitle}>
            🔗 배열 문법이란?
          </ThemedText>
          <ThemedText style={styles.explanationText}>
            <ThemedText style={styles.bold}>문법:</ThemedText> (group1,group2,group3)
            {"\n\n"}
            <ThemedText style={styles.bold}>효과:</ThemedText>
            {"\n"}• 하나의 파일이 여러 경로로 생성됩니다
            {"\n"}• 각 그룹에서 독립적으로 접근 가능
            {"\n"}• 코드는 한 곳에서 관리
            {"\n\n"}
            <ThemedText style={styles.highlight}>
              ✨ Instagram, Twitter처럼 같은 프로필 화면을 여러 탭에서 접근!
            </ThemedText>
          </ThemedText>
        </View>

        <View style={[styles.codeBox, { backgroundColor: colors.card }]}>
          <ThemedText style={styles.codeTitle}>📂 파일 구조</ThemedText>
          <ThemedText style={styles.codeText}>
            {`app/
├── (home,search)/           ← 배열 문법!
│   ├── _layout.tsx
│   ├── index.tsx
│   └── [user].tsx          ← 공유되는 파일

생성되는 경로:
• /(home)/[user]  → /[user] (홈 탭에서)
• /(search)/[user] → /[user] (검색 탭에서)`}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🚀 실습: 사용자 프로필 공유
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            동일한 프로필 화면이 홈과 검색 탭 모두에서 사용됩니다
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4ECDC4" },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/route-groups-guide/03-shared-routes/user-baconbrix")
            }
          >
            <Text style={styles.buttonText}>프로필 보기: @baconbrix →</Text>
            <Text style={styles.buttonSubtext}>
              홈과 검색 탭 모두에서 접근 가능
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.tint },
              pressed && styles.buttonPressed,
            ]}
            onPress={() =>
              router.push("/route-groups-guide/03-shared-routes/user-expo")
            }
          >
            <Text style={styles.buttonText}>프로필 보기: @expo →</Text>
            <Text style={styles.buttonSubtext}>
              같은 화면, 다른 네비게이션 컨텍스트
            </Text>
          </Pressable>
        </View>

        <View
          style={[
            styles.useCaseBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.useCaseTitle}>
            💡 실전 활용 사례
          </ThemedText>
          <ThemedText style={styles.useCaseText}>
            <ThemedText style={styles.bold}>Instagram:</ThemedText>
            {"\n"}프로필 → 홈 피드, 검색, 알림에서 모두 접근
            {"\n\n"}
            <ThemedText style={styles.bold}>Twitter (X):</ThemedText>
            {"\n"}트윗 상세 → 홈, 탐색, 알림에서 모두 접근
            {"\n\n"}
            <ThemedText style={styles.bold}>YouTube:</ThemedText>
            {"\n"}비디오 재생 → 홈, 검색, 구독에서 모두 접근
            {"\n\n"}
            <ThemedText style={styles.highlight}>
              ✓ 코드 중복 제거
              {"\n"}✓ 네비게이션 컨텍스트 유지
              {"\n"}✓ 뒤로 가기 동작 자연스러움
            </ThemedText>
          </ThemedText>
        </View>

        <View
          style={[
            styles.takeawaysBox,
            { backgroundColor: colors.card, borderColor: "#FFB347" },
          ]}
        >
          <ThemedText type="subtitle" style={styles.takeawaysTitle}>
            🎯 핵심 포인트
          </ThemedText>
          <ThemedText style={styles.takeawaysText}>
            ✓ (group1,group2) 문법으로 화면 공유{"\n"}
            ✓ 하나의 파일, 여러 경로{"\n"}
            ✓ 네비게이션 컨텍스트는 독립적{"\n"}
            ✓ 네이티브 앱 패턴의 핵심 기능
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
  highlight: { fontWeight: "600", color: "#4ECDC4" },
  codeBox: { marginHorizontal: 20, marginTop: 20, padding: 20, borderRadius: 12 },
  codeTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  codeText: { fontSize: 13, fontFamily: "monospace", opacity: 0.8, lineHeight: 20 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 8 },
  sectionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 16 },
  button: { padding: 16, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  buttonPressed: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  buttonSubtext: { fontSize: 12, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 },
  useCaseBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  useCaseTitle: { marginBottom: 12 },
  useCaseText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  takeawaysBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  takeawaysTitle: { marginBottom: 12 },
  takeawaysText: { fontSize: 13, lineHeight: 20, opacity: 0.8 },
});
