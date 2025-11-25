/**
 * 03. Shared Routes - 배열 문법으로 화면 공유
 *
 * 이 화면은 가이드 진입점입니다.
 * 실제 배열 문법 동작은 (home)과 (search) 탭에서 확인할 수 있습니다.
 *
 * 파일 구조:
 * app/route-groups-guide/03-shared-routes/
 * ├── _layout.tsx          ← 탭 네비게이터 (홈, 검색)
 * ├── index.tsx            ← 이 파일 (가이드)
 * ├── (home)/
 * │   ├── _layout.tsx      ← 홈 탭 스택
 * │   ├── index.tsx        ← 홈 탭 메인
 * │   └── [user].tsx       ← 프로필 (공유 컴포넌트 import)
 * ├── (search)/
 * │   ├── _layout.tsx      ← 검색 탭 스택
 * │   ├── index.tsx        ← 검색 탭 메인
 * │   └── [user].tsx       ← 프로필 (공유 컴포넌트 import)
 * └── _shared/
 *     └── UserProfileScreen.tsx  ← 실제 프로필 로직 (공유)
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function SharedRoutesGuideScreen() {
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
          <ThemedText style={styles.codeTitle}>📂 현재 파일 구조</ThemedText>
          <ThemedText style={styles.codeText}>
            {`03-shared-routes/
├── _layout.tsx        ← 탭 네비게이터
├── index.tsx          ← 이 화면 (가이드)
├── _shared/           ← 공유 컴포넌트
│   └── UserProfileScreen.tsx
├── (home)/
│   ├── _layout.tsx    ← Stack
│   ├── index.tsx      ← 홈 탭 메인
│   └── [user].tsx     ← import 후 export
└── (search)/
    ├── _layout.tsx    ← Stack
    ├── index.tsx      ← 검색 탭 메인
    └── [user].tsx     ← import 후 export`}
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🚀 실습: 탭으로 이동하여 테스트
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>
            아래 탭을 눌러 홈/검색 탭으로 이동한 후,{"\n"}
            각 탭에서 프로필을 클릭해보세요!
          </ThemedText>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#4ECDC4" },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/route-groups-guide/03-shared-routes/(home)")}
          >
            <Text style={styles.buttonText}>🏠 홈 탭으로 이동</Text>
            <Text style={styles.buttonSubtext}>
              홈 탭에서 프로필 클릭 → "(home)" 컨텍스트
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: "#FF6B6B" },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/route-groups-guide/03-shared-routes/(search)")}
          >
            <Text style={styles.buttonText}>🔍 검색 탭으로 이동</Text>
            <Text style={styles.buttonSubtext}>
              검색 탭에서 프로필 클릭 → "(search)" 컨텍스트
            </Text>
          </Pressable>
        </View>

        <View style={[styles.howItWorksBox, { backgroundColor: colors.card, borderColor: "#FFB347" }]}>
          <ThemedText type="subtitle" style={styles.howItWorksTitle}>
            ⚙️ 동작 원리
          </ThemedText>
          <ThemedText style={styles.howItWorksText}>
            <ThemedText style={styles.bold}>1. 홈 탭에서 프로필 이동:</ThemedText>
            {"\n"}
            <ThemedText style={styles.code}>router.push("/(home)/user-baconbrix")</ThemedText>
            {"\n"}→ segments에 "(home)" 포함
            {"\n"}→ 뒤로 가기 시 홈 탭으로 복귀
            {"\n\n"}
            <ThemedText style={styles.bold}>2. 검색 탭에서 프로필 이동:</ThemedText>
            {"\n"}
            <ThemedText style={styles.code}>router.push("/(search)/user-baconbrix")</ThemedText>
            {"\n"}→ segments에 "(search)" 포함
            {"\n"}→ 뒤로 가기 시 검색 탭으로 복귀
            {"\n\n"}
            <ThemedText style={styles.bold}>3. 같은 [user].tsx 파일:</ThemedText>
            {"\n"}두 경로 모두 (home,search)/[user].tsx 사용!
          </ThemedText>
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
            ✓ 각 그룹에 _layout.tsx (Stack) 필요{"\n"}
            ✓ useSegments()로 현재 그룹 확인{"\n"}
            ✓ 네비게이션 스택은 그룹별로 독립
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
  codeText: { fontSize: 12, fontFamily: "monospace", opacity: 0.8, lineHeight: 18 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { marginBottom: 8 },
  sectionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 16, lineHeight: 20 },
  button: { padding: 16, borderRadius: 8, marginBottom: 12, alignItems: "center" },
  buttonPressed: { opacity: 0.7 },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  buttonSubtext: { fontSize: 12, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 },
  howItWorksBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  howItWorksTitle: { marginBottom: 12 },
  howItWorksText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  code: { fontFamily: "monospace", fontSize: 11, backgroundColor: "rgba(0,0,0,0.1)" },
  useCaseBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  useCaseTitle: { marginBottom: 12 },
  useCaseText: { fontSize: 13, lineHeight: 22, opacity: 0.8 },
  takeawaysBox: { marginHorizontal: 20, marginTop: 24, padding: 20, borderRadius: 12, borderWidth: 2 },
  takeawaysTitle: { marginBottom: 12 },
  takeawaysText: { fontSize: 13, lineHeight: 20, opacity: 0.8 },
});
