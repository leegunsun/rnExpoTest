/**
 * App Bar Examples for Flutter Developers
 *
 * Flutter의 AppBar를 React Native Expo에서 구현하는 다양한 방법
 *
 * Flutter AppBar 개념:
 * - AppBar: 상단 네비게이션 바
 * - SliverAppBar: 스크롤 가능한 앱 바
 * - leading: 왼쪽 위젯 (뒤로가기 버튼 등)
 * - title: 제목
 * - actions: 오른쪽 액션 버튼들
 * - backgroundColor: 배경색
 * - elevation: 그림자 깊이
 *
 * React Native Expo 구현 방법:
 * 1. Expo Router의 Stack.Screen options (권장)
 * 2. 커스텀 헤더 컴포넌트
 * 3. SafeAreaView + 커스텀 구현
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
} from "react-native";

export default function AppBarExampleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [activeExample, setActiveExample] = useState<string | null>(null);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Example 1: 기본 앱 바 (Custom Component) */}
        <ExampleSection
          title="1. 기본 앱 바 (커스텀 컴포넌트)"
          flutterCode={`AppBar(
  leading: IconButton(
    icon: Icon(Icons.arrow_back),
    onPressed: () => Navigator.pop(context),
  ),
  title: Text('제목'),
  actions: [
    IconButton(
      icon: Icon(Icons.search),
      onPressed: () {},
    ),
    IconButton(
      icon: Icon(Icons.more_vert),
      onPressed: () {},
    ),
  ],
  backgroundColor: Colors.blue,
  elevation: 4,
)`}
          rnCode={`// 커스텀 AppBar 컴포넌트
<SafeAreaView>
  <View style={styles.appBar}>
    <Pressable onPress={() => router.back()}>
      <Text>←</Text>
    </Pressable>
    <Text style={styles.title}>제목</Text>
    <View style={styles.actions}>
      <Pressable onPress={() => {}}>
        <Text>🔍</Text>
      </Pressable>
      <Pressable onPress={() => {}}>
        <Text>⋮</Text>
      </Pressable>
    </View>
  </View>
</SafeAreaView>`}
        >
          <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
            <BasicAppBar
              title="기본 앱 바"
              onBackPress={() => router.back()}
              onSearchPress={() => setActiveExample("search")}
              onMenuPress={() => setActiveExample("menu")}
            />
            <View style={styles.content}>
              <Text style={[styles.contentText, { color: colors.text }]}>
                {activeExample
                  ? `${activeExample} 버튼을 눌렀습니다`
                  : "버튼을 눌러보세요"}
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 2: 중앙 정렬 제목 */}
        <ExampleSection
          title="2. 중앙 정렬 제목"
          flutterCode={`AppBar(
  centerTitle: true,  // 제목 중앙 정렬
  title: Text('중앙 제목'),
  backgroundColor: Colors.purple,
)`}
          rnCode={`<View style={styles.appBar}>
  <View style={{ width: 40 }} /> {/* 왼쪽 공간 */}
  <Text style={styles.centerTitle}>중앙 제목</Text>
  <View style={{ width: 40 }} /> {/* 오른쪽 공간 */}
</View>`}
        >
          <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
            <CenteredTitleAppBar
              title="중앙 정렬 제목"
              backgroundColor="#9B59B6"
            />
            <View style={styles.content}>
              <Text style={[styles.contentText, { color: colors.text }]}>
                제목이 중앙에 배치되었습니다
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 3: 투명 앱 바 */}
        <ExampleSection
          title="3. 투명 앱 바 (Transparent)"
          flutterCode={`AppBar(
  backgroundColor: Colors.transparent,
  elevation: 0,
  title: Text('투명 앱 바'),
  foregroundColor: Colors.white,
)`}
          rnCode={`<View style={{
  ...styles.appBar,
  backgroundColor: 'transparent',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
}}>
  <Text style={{ color: 'white' }}>투명 앱 바</Text>
</View>`}
        >
          <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
            <View style={styles.imageBackground}>
              <TransparentAppBar
                title="투명 앱 바"
                onBackPress={() => {}}
              />
              <View style={styles.imageContent}>
                <Text style={styles.whiteText}>배경 이미지 위에 앱 바</Text>
              </View>
            </View>
          </View>
        </ExampleSection>

        {/* Example 4: 탭바가 있는 앱 바 */}
        <ExampleSection
          title="4. 탭바가 있는 앱 바"
          flutterCode={`AppBar(
  title: Text('탭 앱 바'),
  bottom: TabBar(
    tabs: [
      Tab(text: '홈'),
      Tab(text: '검색'),
      Tab(text: '프로필'),
    ],
  ),
)`}
          rnCode={`<View>
  <View style={styles.appBar}>
    <Text>탭 앱 바</Text>
  </View>
  <View style={styles.tabBar}>
    <Pressable style={styles.tab}>
      <Text>홈</Text>
    </Pressable>
    <Pressable style={styles.tab}>
      <Text>검색</Text>
    </Pressable>
    <Pressable style={styles.tab}>
      <Text>프로필</Text>
    </Pressable>
  </View>
</View>`}
        >
          <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
            <TabAppBar
              title="탭 앱 바"
              tabs={["홈", "검색", "프로필"]}
              activeTab={0}
              onTabPress={(index) => console.log("Tab", index)}
            />
            <View style={styles.content}>
              <Text style={[styles.contentText, { color: colors.text }]}>
                탭을 눌러 전환할 수 있습니다
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 5: 검색 앱 바 */}
        <ExampleSection
          title="5. 검색 앱 바"
          flutterCode={`AppBar(
  title: TextField(
    decoration: InputDecoration(
      hintText: '검색...',
      border: InputBorder.none,
    ),
  ),
  actions: [
    IconButton(
      icon: Icon(Icons.close),
      onPressed: () {},
    ),
  ],
)`}
          rnCode={`<View style={styles.appBar}>
  <TextInput
    placeholder="검색..."
    style={styles.searchInput}
  />
  <Pressable onPress={() => {}}>
    <Text>✕</Text>
  </Pressable>
</View>`}
        >
          <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
            <SearchAppBar
              placeholder="검색어를 입력하세요..."
              onClose={() => {}}
            />
            <View style={styles.content}>
              <Text style={[styles.contentText, { color: colors.text }]}>
                검색 입력란이 앱 바에 통합되었습니다
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Summary */}
        <View
          style={[
            styles.summaryBox,
            { backgroundColor: colors.card, borderColor: colors.tint },
          ]}
        >
          <ThemedText type="subtitle" style={styles.summaryTitle}>
            핵심 요약
          </ThemedText>
          <ThemedText style={styles.summaryText}>
            • Flutter AppBar → RN의 커스텀 헤더 컴포넌트{"\n"}
            • leading → 왼쪽 Pressable 버튼{"\n"}
            • title → 중앙 Text 컴포넌트{"\n"}
            • actions → 오른쪽 View with Pressables{"\n"}
            • SafeAreaView로 노치 영역 처리{"\n"}
            • Expo Router의 Stack.Screen options도 활용 가능{"\n"}
            • elevation → shadowOffset, shadowOpacity{"\n"}
            • centerTitle → justifyContent: 'space-between'
          </ThemedText>
        </View>

        {/* Navigation Button */}
        <Pressable
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: colors.tint },
            pressed && styles.navButtonPressed,
          ]}
          onPress={() => router.push("/(examples)/bottom-nav-example")}
        >
          <Text style={styles.navButtonText}>
            다음: 바텀 네비게이션 →
          </Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ===== 재사용 가능한 AppBar 컴포넌트들 =====

interface BasicAppBarProps {
  title: string;
  onBackPress?: () => void;
  onSearchPress?: () => void;
  onMenuPress?: () => void;
  backgroundColor?: string;
}

function BasicAppBar({
  title,
  onBackPress,
  onSearchPress,
  onMenuPress,
  backgroundColor = "#4ECDC4",
}: BasicAppBarProps) {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <View style={[styles.appBar, { backgroundColor }]}>
        {/* Leading */}
        {onBackPress && (
          <Pressable onPress={onBackPress} style={styles.iconButton}>
            <Text style={styles.iconText}>←</Text>
          </Pressable>
        )}

        {/* Title */}
        <Text style={styles.appBarTitle}>{title}</Text>

        {/* Actions */}
        <View style={styles.actions}>
          {onSearchPress && (
            <Pressable onPress={onSearchPress} style={styles.iconButton}>
              <Text style={styles.iconText}>🔍</Text>
            </Pressable>
          )}
          {onMenuPress && (
            <Pressable onPress={onMenuPress} style={styles.iconButton}>
              <Text style={styles.iconText}>⋮</Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

interface CenteredTitleAppBarProps {
  title: string;
  backgroundColor?: string;
}

function CenteredTitleAppBar({
  title,
  backgroundColor = "#9B59B6",
}: CenteredTitleAppBarProps) {
  return (
    <SafeAreaView style={{ backgroundColor }}>
      <View style={[styles.appBar, { backgroundColor, justifyContent: "space-between" }]}>
        <View style={{ width: 40 }} />
        <Text style={styles.appBarTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>
    </SafeAreaView>
  );
}

interface TransparentAppBarProps {
  title: string;
  onBackPress: () => void;
}

function TransparentAppBar({ title, onBackPress }: TransparentAppBarProps) {
  return (
    <View style={styles.transparentAppBar}>
      <Pressable onPress={onBackPress} style={styles.iconButton}>
        <Text style={[styles.iconText, { color: "white" }]}>←</Text>
      </Pressable>
      <Text style={[styles.appBarTitle, { color: "white" }]}>{title}</Text>
      <View style={{ width: 40 }} />
    </View>
  );
}

interface TabAppBarProps {
  title: string;
  tabs: string[];
  activeTab: number;
  onTabPress: (index: number) => void;
}

function TabAppBar({ title, tabs, activeTab, onTabPress }: TabAppBarProps) {
  return (
    <SafeAreaView style={{ backgroundColor: "#3498DB" }}>
      <View>
        {/* AppBar */}
        <View style={[styles.appBar, { backgroundColor: "#3498DB" }]}>
          <Text style={styles.appBarTitle}>{title}</Text>
        </View>

        {/* TabBar */}
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => (
            <Pressable
              key={index}
              style={[styles.tab, activeTab === index && styles.activeTab]}
              onPress={() => onTabPress(index)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === index && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

interface SearchAppBarProps {
  placeholder: string;
  onClose: () => void;
}

function SearchAppBar({ placeholder, onClose }: SearchAppBarProps) {
  return (
    <SafeAreaView style={{ backgroundColor: "#E74C3C" }}>
      <View style={[styles.appBar, { backgroundColor: "#E74C3C" }]}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchPlaceholder}>{placeholder}</Text>
        </View>
        <Pressable onPress={onClose} style={styles.iconButton}>
          <Text style={styles.iconText}>✕</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// ===== Example Section Component =====

interface ExampleSectionProps {
  title: string;
  flutterCode: string;
  rnCode: string;
  children: React.ReactNode;
}

function ExampleSection({
  title,
  flutterCode,
  rnCode,
  children,
}: ExampleSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.section}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        {title}
      </ThemedText>

      {/* Flutter Code */}
      <View style={[styles.codeBlock, { backgroundColor: colors.card }]}>
        <Text style={[styles.codeLabel, { color: colors.tint }]}>Flutter:</Text>
        <Text style={[styles.codeText, { color: colors.text }]}>
          {flutterCode}
        </Text>
      </View>

      {/* React Native Code */}
      <View style={[styles.codeBlock, { backgroundColor: colors.card }]}>
        <Text style={[styles.codeLabel, { color: colors.tint }]}>
          React Native:
        </Text>
        <Text style={[styles.codeText, { color: colors.text }]}>{rnCode}</Text>
      </View>

      {/* Live Example */}
      <View style={styles.liveExample}>
        <Text style={[styles.liveLabel, { color: colors.tint }]}>
          실행 결과:
        </Text>
        {children}
      </View>
    </View>
  );
}

// ===== Styles =====

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
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
  codeLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  codeText: {
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  liveExample: {
    marginTop: 8,
  },
  liveLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  exampleContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  // AppBar 스타일
  appBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  appBarTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    flex: 1,
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    padding: 20,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  contentText: {
    fontSize: 14,
  },
  // Transparent AppBar
  transparentAppBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  imageBackground: {
    backgroundColor: "#3498DB",
    height: 200,
    position: "relative",
  },
  imageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // TabBar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#3498DB",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "white",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "white",
  },
  // Search AppBar
  searchContainer: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  searchPlaceholder: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  summaryBox: {
    marginHorizontal: 20,
    marginTop: 32,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  summaryTitle: {
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 20,
  },
  navButton: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
