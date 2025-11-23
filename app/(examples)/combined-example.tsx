/**
 * Combined Example - Complete App Structure
 *
 * Flutter의 Scaffold 전체 구조를 React Native Expo로 구현
 *
 * Flutter Scaffold 개념:
 * - Scaffold: 앱의 기본 구조를 제공하는 위젯
 * - appBar: 상단 앱 바
 * - body: 메인 콘텐츠 영역
 * - bottomNavigationBar: 하단 네비게이션 바
 * - floatingActionButton: 플로팅 액션 버튼
 * - drawer: 사이드 메뉴 (옵션)
 * - backgroundColor: 배경색
 *
 * React Native Expo 구현:
 * - 모든 요소를 조합하여 완전한 앱 구조 생성
 * - SafeAreaView로 안전 영역 처리
 * - position: 'absolute'로 FAB 배치
 * - flexbox로 레이아웃 구성
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

// 탭 데이터
const TABS = [
  { id: "home", icon: "🏠", label: "홈" },
  { id: "search", icon: "🔍", label: "검색" },
  { id: "favorites", icon: "❤️", label: "좋아요" },
  { id: "profile", icon: "👤", label: "프로필" },
];

export default function CombinedExampleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [activeTab, setActiveTab] = useState("home");

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Introduction */}
        <View style={[styles.introBox, { backgroundColor: colors.card }]}>
          <ThemedText type="title" style={styles.introTitle}>
            통합 예제 🎯
          </ThemedText>
          <ThemedText style={styles.introText}>
            AppBar, BottomNavigation, FAB을 모두 조합한{"\n"}
            완전한 앱 구조 예제입니다.
          </ThemedText>
        </View>

        {/* Flutter vs RN Comparison */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Flutter Scaffold
          </ThemedText>
          <View style={[styles.codeBlock, { backgroundColor: colors.card }]}>
            <Text style={[styles.codeText, { color: colors.text }]}>
              {`Scaffold(
  appBar: AppBar(
    title: Text('홈'),
    actions: [
      IconButton(
        icon: Icon(Icons.search),
        onPressed: () {},
      ),
    ],
  ),
  body: Center(
    child: Text('메인 콘텐츠'),
  ),
  bottomNavigationBar: BottomNavigationBar(
    currentIndex: _selectedIndex,
    onTap: (index) {
      setState(() => _selectedIndex = index);
    },
    items: [
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: '홈',
      ),
      // ... 더 많은 아이템들
    ],
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
)`}
            </Text>
          </View>
        </View>

        {/* React Native Implementation */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            React Native Expo 구현
          </ThemedText>
          <View style={[styles.codeBlock, { backgroundColor: colors.card }]}>
            <Text style={[styles.codeText, { color: colors.text }]}>
              {`<View style={{ flex: 1 }}>
  {/* AppBar */}
  <SafeAreaView>
    <View style={styles.appBar}>
      <Text>홈</Text>
      <Pressable>
        <Text>🔍</Text>
      </Pressable>
    </View>
  </SafeAreaView>

  {/* Body */}
  <View style={{ flex: 1 }}>
    <Text>메인 콘텐츠</Text>
  </View>

  {/* Bottom Navigation */}
  <SafeAreaView>
    <View style={styles.bottomNav}>
      {/* 네비게이션 아이템들 */}
    </View>
  </SafeAreaView>

  {/* FAB */}
  <Pressable style={styles.fab}>
    <Text>+</Text>
  </Pressable>
</View>`}
            </Text>
          </View>
        </View>

        {/* Live Example */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            실행 결과
          </ThemedText>
          <View style={[styles.liveExampleContainer, { backgroundColor: colors.card }]}>
            <CompleteAppExample
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </View>
        </View>

        {/* Structure Breakdown */}
        <View
          style={[
            styles.breakdownBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.breakdownTitle}>
            구조 분석
          </ThemedText>
          <ThemedText style={styles.breakdownText}>
            1️⃣ <Text style={{ fontWeight: "700" }}>AppBar (상단)</Text>
            {"\n"}• SafeAreaView로 노치 영역 처리
            {"\n"}• 제목 + 액션 버튼 배치
            {"\n"}• 고정 높이 (56px)
            {"\n\n"}
            2️⃣ <Text style={{ fontWeight: "700" }}>Body (중앙)</Text>
            {"\n"}• flex: 1로 남은 공간 차지
            {"\n"}• ScrollView로 스크롤 가능
            {"\n"}• 메인 콘텐츠 영역
            {"\n\n"}
            3️⃣ <Text style={{ fontWeight: "700" }}>Bottom Navigation (하단)</Text>
            {"\n"}• SafeAreaView로 홈 인디케이터 처리
            {"\n"}• 탭 아이템 배치
            {"\n"}• 현재 선택 상태 표시
            {"\n\n"}
            4️⃣ <Text style={{ fontWeight: "700" }}>FAB (플로팅)</Text>
            {"\n"}• position: 'absolute'로 배치
            {"\n"}• 우측 하단 고정
            {"\n"}• 그림자 효과 적용
          </ThemedText>
        </View>

        {/* Key Points */}
        <View
          style={[
            styles.keyPointsBox,
            { backgroundColor: colors.card, borderColor: "#2ECC71" },
          ]}
        >
          <ThemedText type="subtitle" style={styles.keyPointsTitle}>
            핵심 포인트
          </ThemedText>
          <ThemedText style={styles.keyPointsText}>
            ✅ Flutter Scaffold = RN의 View + SafeAreaView 조합{"\n\n"}
            ✅ 각 섹션은 독립적으로 재사용 가능{"\n\n"}
            ✅ SafeAreaView는 iOS 노치/홈 인디케이터 대응{"\n\n"}
            ✅ FAB은 최상위 레이어에 배치{"\n\n"}
            ✅ 상태 관리는 useState 또는 전역 상태 사용{"\n\n"}
            ✅ Expo Router의 Tabs 레이아웃도 활용 가능
          </ThemedText>
        </View>

        {/* Navigation Button */}
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            styles.navButtonSecondary,
            { borderColor: colors.tint },
            pressed && styles.navButtonPressed,
          ]}
          onPress={() => router.push("/(examples)/")}
        >
          <Text style={[styles.navButtonText, { color: colors.tint }]}>
            ← 예제 목록으로
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ===== Complete App Example Component =====

interface CompleteAppExampleProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function CompleteAppExample({ activeTab, onTabChange }: CompleteAppExampleProps) {
  const [searchVisible, setSearchVisible] = useState(false);

  const getTabContent = () => {
    switch (activeTab) {
      case "home":
        return {
          title: "홈",
          content: "홈 화면 콘텐츠",
          items: ["최근 활동", "추천 콘텐츠", "트렌딩"],
        };
      case "search":
        return {
          title: "검색",
          content: "검색 화면",
          items: ["인기 검색어", "최근 검색", "카테고리"],
        };
      case "favorites":
        return {
          title: "좋아요",
          content: "좋아요 목록",
          items: ["저장된 항목", "북마크", "컬렉션"],
        };
      case "profile":
        return {
          title: "프로필",
          content: "프로필 화면",
          items: ["내 정보", "설정", "알림"],
        };
      default:
        return {
          title: "홈",
          content: "홈 화면",
          items: [],
        };
    }
  };

  const tabContent = getTabContent();

  return (
    <View style={styles.appContainer}>
      {/* AppBar */}
      <SafeAreaView style={{ backgroundColor: "#4ECDC4" }}>
        <View style={styles.appBar}>
          <Text style={styles.appBarTitle}>{tabContent.title}</Text>
          <View style={styles.appBarActions}>
            <Pressable
              style={styles.iconButton}
              onPress={() => setSearchVisible(!searchVisible)}
            >
              <Text style={styles.iconText}>🔍</Text>
            </Pressable>
            <Pressable
              style={styles.iconButton}
              onPress={() => Alert.alert("메뉴", "더보기 메뉴")}
            >
              <Text style={styles.iconText}>⋮</Text>
            </Pressable>
          </View>
        </View>

        {/* Search Bar (조건부 표시) */}
        {searchVisible && (
          <View style={styles.searchBar}>
            <View style={styles.searchInput}>
              <Text style={styles.searchPlaceholder}>검색...</Text>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.bodyContent}>
          <Text style={styles.contentTitle}>{tabContent.content}</Text>
          {tabContent.items.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listItemIcon}>•</Text>
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Navigation */}
      <SafeAreaView style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={styles.navItem}
              onPress={() => onTabChange(tab.id)}
            >
              <Text
                style={[
                  styles.navIcon,
                  { opacity: activeTab === tab.id ? 1 : 0.5 },
                ]}
              >
                {tab.icon}
              </Text>
              <Text
                style={[
                  styles.navLabel,
                  {
                    color: activeTab === tab.id ? "#4ECDC4" : "#95A5A6",
                    fontWeight: activeTab === tab.id ? "600" : "400",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
        onPress={() => Alert.alert("FAB", "새 항목 추가!")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

// ===== Styles =====

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingBottom: 40,
  },
  introBox: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  introTitle: {
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  codeBlock: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontSize: 10,
    fontFamily: "monospace",
    lineHeight: 15,
  },
  liveExampleContainer: {
    borderRadius: 12,
    overflow: "hidden",
    height: 500,
  },
  // App Container
  appContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  // AppBar
  appBar: {
    height: 56,
    backgroundColor: "#4ECDC4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  appBarActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: "white",
  },
  searchBar: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    justifyContent: "center",
  },
  searchPlaceholder: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  // Body
  body: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  bodyContent: {
    padding: 20,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  listItemIcon: {
    fontSize: 16,
    color: "#4ECDC4",
    marginRight: 12,
  },
  listItemText: {
    fontSize: 14,
    color: "#34495E",
  },
  // Bottom Navigation
  bottomNavContainer: {
    backgroundColor: "white",
  },
  bottomNav: {
    flexDirection: "row",
    height: 56,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 11,
  },
  // FAB
  fab: {
    position: "absolute",
    bottom: 72,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: "white",
  },
  // Breakdown Box
  breakdownBox: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  breakdownTitle: {
    marginBottom: 12,
  },
  breakdownText: {
    fontSize: 13,
    lineHeight: 20,
    opacity: 0.9,
  },
  // Key Points Box
  keyPointsBox: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  keyPointsTitle: {
    marginBottom: 12,
  },
  keyPointsText: {
    fontSize: 13,
    lineHeight: 22,
    opacity: 0.9,
  },
  // Navigation Button
  navButton: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  navButtonSecondary: {
    borderWidth: 2,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
