/**
 * Route Groups Guide - 메인 메뉴
 *
 * Expo Router의 Route Groups 개념을 학습하기 위한 예제 모음
 * 공식 문서 기반 실전 예제
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { shadows } from "@/utils/shadow-utils";

interface Example {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  difficulty: "basic" | "intermediate" | "advanced";
}

const EXAMPLES: Example[] = [
  {
    id: "01-basic",
    title: "01. 기본 개념",
    description: "Route Groups vs 일반 디렉터리 비교",
    route: "/route-groups-guide/01-basic",
    icon: "📁",
    difficulty: "basic",
  },
  {
    id: "02-layouts",
    title: "02. Layout 패턴",
    description: "Route Groups로 다양한 레이아웃 구성",
    route: "/route-groups-guide/02-layouts",
    icon: "🎨",
    difficulty: "basic",
  },
  {
    id: "03-shared-routes",
    title: "03. Shared Routes",
    description: "배열 문법으로 화면 공유하기",
    route: "/route-groups-guide/03-shared-routes",
    icon: "🔗",
    difficulty: "intermediate",
  },
  {
    id: "04-auth-flow",
    title: "04. 인증 흐름",
    description: "로그인/로그아웃 화면 분리",
    route: "/route-groups-guide/04-auth-flow",
    icon: "🔐",
    difficulty: "intermediate",
  },
  {
    id: "05-complex",
    title: "05. 복합 예제",
    description: "실전 앱 구조 (Tab + Shared Routes)",
    route: "/route-groups-guide/05-complex",
    icon: "🚀",
    difficulty: "advanced",
  },
];

export default function RouteGroupsGuideScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getDifficultyColor = (difficulty: Example["difficulty"]) => {
    switch (difficulty) {
      case "basic":
        return "#4ECDC4";
      case "intermediate":
        return "#FFB347";
      case "advanced":
        return "#FF6B6B";
    }
  };

  const getDifficultyLabel = (difficulty: Example["difficulty"]) => {
    switch (difficulty) {
      case "basic":
        return "기초";
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
              ← 뒤로
            </Text>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            Route Groups 가이드
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Expo Router 공식 문서 기반 📚
          </ThemedText>
        </View>

        {/* Introduction */}
        <View style={[styles.introBox, { backgroundColor: colors.card }]}>
          <ThemedText type="subtitle" style={styles.introTitle}>
            🎯 Route Groups란?
          </ThemedText>
          <ThemedText style={styles.introText}>
            괄호로 감싼 디렉터리명 (예: (tabs))은 URL 경로에 포함되지 않습니다.
            {"\n\n"}
            <ThemedText style={styles.bold}>예시:</ThemedText>
            {"\n"}• app/(tabs)/feed.tsx → /feed
            {"\n"}• app/tabs/feed.tsx → /tabs/feed
            {"\n\n"}
            파일 구조를 조직화하면서 URL은 간결하게 유지할 수 있습니다.
          </ThemedText>
        </View>

        {/* Examples List */}
        <View style={styles.examplesContainer}>
          {EXAMPLES.map((example) => (
            <Pressable
              key={example.id}
              style={({ pressed }) => [
                styles.exampleCard,
                { backgroundColor: colors.card },
                pressed && styles.exampleCardPressed,
              ]}
              onPress={() => router.push(example.route as any)}
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

        {/* Key Concepts */}
        <View
          style={[
            styles.conceptsBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.conceptsTitle}>
            💡 핵심 개념
          </ThemedText>
          <ThemedText style={styles.conceptsText}>
            <ThemedText style={styles.bold}>1. 조직화</ThemedText>
            {"\n"}   URL에 영향 없이 파일 구조 정리
            {"\n\n"}
            <ThemedText style={styles.bold}>2. Layout 공유</ThemedText>
            {"\n"}   _layout.tsx로 공통 레이아웃 적용
            {"\n\n"}
            <ThemedText style={styles.bold}>3. Shared Routes</ThemedText>
            {"\n"}   배열 문법으로 여러 그룹에서 화면 공유
            {"\n\n"}
            <ThemedText style={styles.bold}>4. Typed Routes</ThemedText>
            {"\n"}   타입 안전성 유지하며 네비게이션
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
  bold: {
    fontWeight: "700",
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
    ...shadows.md,
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
  conceptsBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  conceptsTitle: {
    marginBottom: 12,
  },
  conceptsText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.8,
  },
});
