/**
 * Examples Index - Flutter 개발자를 위한 React Native Expo 예제 모음
 *
 * Flutter에서 자주 사용하는 UI 패턴들을 React Native Expo로 구현하는 방법을 학습합니다.
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter, Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// 예제 데이터 타입
interface ExampleItem {
  id: string;
  title: string;
  description: string;
  flutterEquivalent: string;
  route: Href;
  icon: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// 예제 목록
const EXAMPLES: ExampleItem[] = [
  {
    id: "layout",
    title: "레이아웃 기초",
    description: "Column, Row, Flex, Stack 등 기본 레이아웃 패턴",
    flutterEquivalent: "Column, Row, Flexible, Stack",
    route: "/examples/layout-examples",
    icon: "📐",
    difficulty: "beginner",
  },
  {
    id: "appbar",
    title: "앱 바 (App Bar)",
    description: "상단 네비게이션 바와 헤더 구현",
    flutterEquivalent: "AppBar, SliverAppBar",
    route: "/examples/appbar-example",
    icon: "📱",
    difficulty: "beginner",
  },
  {
    id: "bottom-nav",
    title: "바텀 네비게이션",
    description: "하단 탭 네비게이션 구현",
    flutterEquivalent: "BottomNavigationBar, NavigationBar",
    route: "/examples/bottom-nav-example",
    icon: "🧭",
    difficulty: "beginner",
  },
  {
    id: "fab",
    title: "플로팅 액션 버튼",
    description: "화면에 떠있는 액션 버튼 구현",
    flutterEquivalent: "FloatingActionButton",
    route: "/examples/fab-example",
    icon: "➕",
    difficulty: "beginner",
  },
  {
    id: "combined",
    title: "통합 예제",
    description: "AppBar + BottomNav + FAB 실전 구현",
    flutterEquivalent: "Scaffold 전체 구조",
    route: "/examples/combined-example",
    icon: "🎯",
    difficulty: "intermediate",
  },
  {
    id: "responsive",
    title: "반응형 스케일링",
    description: "react-native-size-matters 완벽 가이드",
    flutterEquivalent: "flutter_screenutil, responsive_sizer",
    route: "/examples/responsive-example",
    icon: "📏",
    difficulty: "intermediate",
  },
  {
    id: "drawer",
    title: "드로우어 네비게이션",
    description: "사이드 메뉴 (Drawer Navigation) 구현",
    flutterEquivalent: "Drawer, NavigationDrawer",
    route: "/examples/drawer-example",
    icon: "☰",
    difficulty: "intermediate",
  },
];

export default function ExamplesIndexScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getDifficultyColor = (difficulty: ExampleItem["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "#4ECDC4";
      case "intermediate":
        return "#FFB347";
      case "advanced":
        return "#FF6B6B";
    }
  };

  const getDifficultyLabel = (difficulty: ExampleItem["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "초급";
      case "intermediate":
        return "중급";
      case "advanced":
        return "고급";
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backButtonText, { color: colors.tint }]}>
              ← 홈으로
            </Text>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            Flutter → RN Expo
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            학습 예제 모음 📚
          </ThemedText>
        </View>

        {/* Introduction */}
        <View style={[styles.introBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.introTitle}>
            👋 환영합니다!
          </ThemedText>
          <ThemedText style={styles.introText}>
            Flutter 개발자를 위한 React Native Expo 예제 모음입니다.
            {"\n\n"}
            각 예제는 Flutter의 개념과 비교하여 설명되며, 실제 동작하는 코드를 포함합니다.
          </ThemedText>
        </View>

        {/* Examples Grid */}
        <View style={styles.examplesContainer}>
          {EXAMPLES.map((example) => (
            <Pressable
              key={example.id}
              style={({ pressed }) => [
                styles.exampleCard,
                { backgroundColor: colors.card },
                pressed && styles.exampleCardPressed,
              ]}
              onPress={() => router.push(example.route)}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{example.icon}</Text>
              </View>

              {/* Content */}
              <View style={styles.cardContent}>
                <ThemedText type="subtitle" style={styles.cardTitle}>
                  {example.title}
                </ThemedText>
                <ThemedText style={styles.cardDescription}>
                  {example.description}
                </ThemedText>

                {/* Flutter Equivalent */}
                <View style={styles.flutterTag}>
                  <Text style={styles.flutterTagLabel}>Flutter:</Text>
                  <Text style={[styles.flutterTagText, { color: colors.text }]}>
                    {example.flutterEquivalent}
                  </Text>
                </View>

                {/* Difficulty Badge */}
                <View style={styles.badgeContainer}>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: getDifficultyColor(example.difficulty),
                      },
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {getDifficultyLabel(example.difficulty)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Arrow */}
              <View style={styles.arrowContainer}>
                <Text style={[styles.arrow, { color: colors.tint }]}>→</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Tips Section */}
        <View
          style={[
            styles.tipsBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.tipsTitle}>
            💡 학습 팁
          </ThemedText>
          <ThemedText style={styles.tipsText}>
            1. 순서대로 학습하면 이해가 쉽습니다{"\n"}
            2. 각 예제의 코드를 직접 수정해보세요{"\n"}
            3. Flutter 코드와 비교하며 차이점을 파악하세요{"\n"}
            4. 실제 프로젝트에 바로 적용할 수 있습니다
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
  introBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  introTitle: {
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.8,
  },
  examplesContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  exampleCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exampleCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "rgba(78, 205, 196, 0.1)",
  },
  icon: {
    fontSize: 28,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    marginBottom: 4,
    fontSize: 16,
  },
  cardDescription: {
    fontSize: 13,
    opacity: 0.7,
    marginBottom: 8,
  },
  flutterTag: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  flutterTagLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4ECDC4",
    marginRight: 4,
  },
  flutterTagText: {
    fontSize: 11,
    fontFamily: "monospace",
    opacity: 0.7,
  },
  badgeContainer: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  arrowContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
  },
  arrow: {
    fontSize: 24,
    fontWeight: "700",
  },
  tipsBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  tipsTitle: {
    marginBottom: 12,
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
});
