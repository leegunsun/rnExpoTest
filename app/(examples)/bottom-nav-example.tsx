/**
 * Bottom Navigation Examples for Flutter Developers
 *
 * Flutter의 BottomNavigationBar를 React Native Expo에서 구현하는 방법
 *
 * Flutter BottomNavigationBar 개념:
 * - BottomNavigationBar: 하단 탭 네비게이션
 * - BottomNavigationBarItem: 각 탭 아이템
 * - currentIndex: 현재 선택된 탭
 * - onTap: 탭 선택 콜백
 * - type: fixed, shifting
 * - selectedItemColor: 선택된 아이템 색상
 * - unselectedItemColor: 선택되지 않은 아이템 색상
 *
 * React Native Expo 구현 방법:
 * 1. Expo Router의 Tabs 레이아웃 (권장)
 * 2. 커스텀 바텀 네비게이션 컴포넌트
 * 3. React Navigation의 Bottom Tabs
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

export default function BottomNavExampleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Example 1: 기본 바텀 네비게이션 */}
        <ExampleSection
          title="1. 기본 바텀 네비게이션"
          flutterCode={`BottomNavigationBar(
  currentIndex: _selectedIndex,
  onTap: (index) {
    setState(() {
      _selectedIndex = index;
    });
  },
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: '홈',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.search),
      label: '검색',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.person),
      label: '프로필',
    ),
  ],
)`}
          rnCode={`const [selectedIndex, setSelectedIndex] = useState(0);

<View style={styles.bottomNav}>
  <Pressable
    style={styles.navItem}
    onPress={() => setSelectedIndex(0)}
  >
    <Text>🏠</Text>
    <Text style={
      selectedIndex === 0 ? styles.active : styles.inactive
    }>홈</Text>
  </Pressable>
  {/* 나머지 아이템들... */}
</View>`}
        >
          <BasicBottomNav />
        </ExampleSection>

        {/* Example 2: 아이콘 + 라벨 */}
        <ExampleSection
          title="2. 아이콘 + 라벨 (Badge 포함)"
          flutterCode={`BottomNavigationBar(
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: '홈',
    ),
    BottomNavigationBarItem(
      icon: Badge(
        label: Text('3'),
        child: Icon(Icons.message),
      ),
      label: '메시지',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.notifications),
      label: '알림',
    ),
  ],
)`}
          rnCode={`<View style={styles.navItem}>
  <View style={styles.iconContainer}>
    <Text style={styles.icon}>💬</Text>
    {/* Badge */}
    <View style={styles.badge}>
      <Text style={styles.badgeText}>3</Text>
    </View>
  </View>
  <Text style={styles.label}>메시지</Text>
</View>`}
        >
          <BottomNavWithBadge />
        </ExampleSection>

        {/* Example 3: 아이콘만 (Compact) */}
        <ExampleSection
          title="3. 아이콘만 (라벨 숨김)"
          flutterCode={`BottomNavigationBar(
  showSelectedLabels: false,
  showUnselectedLabels: false,
  items: [
    BottomNavigationBarItem(icon: Icon(Icons.home)),
    BottomNavigationBarItem(icon: Icon(Icons.search)),
    BottomNavigationBarItem(icon: Icon(Icons.favorite)),
    BottomNavigationBarItem(icon: Icon(Icons.person)),
  ],
)`}
          rnCode={`<View style={styles.bottomNav}>
  {items.map((item, index) => (
    <Pressable
      key={index}
      style={styles.iconOnlyItem}
    >
      <Text style={styles.icon}>{item.icon}</Text>
    </Pressable>
  ))}
</View>`}
        >
          <IconOnlyBottomNav />
        </ExampleSection>

        {/* Example 4: Shifting Type (선택 시 확대) */}
        <ExampleSection
          title="4. Shifting Type (선택 시 확대)"
          flutterCode={`BottomNavigationBar(
  type: BottomNavigationBarType.shifting,
  selectedItemColor: Colors.blue,
  unselectedItemColor: Colors.grey,
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: '홈',
      backgroundColor: Colors.white,
    ),
    // ...
  ],
)`}
          rnCode={`<Pressable
  style={[
    styles.navItem,
    isSelected && styles.navItemExpanded
  ]}
>
  <Text style={[
    styles.icon,
    isSelected && { fontSize: 28 }
  ]}>🏠</Text>
  {isSelected && (
    <Text style={styles.label}>홈</Text>
  )}
</Pressable>`}
        >
          <ShiftingBottomNav />
        </ExampleSection>

        {/* Example 5: 커스텀 스타일 (둥근 네비게이션) */}
        <ExampleSection
          title="5. 커스텀 스타일 (Floating)"
          flutterCode={`// Flutter에서는 커스텀 위젯 필요
Container(
  margin: EdgeInsets.all(16),
  padding: EdgeInsets.symmetric(vertical: 8),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(24),
    boxShadow: [
      BoxShadow(
        color: Colors.black12,
        blurRadius: 8,
      ),
    ],
  ),
  child: Row(
    mainAxisAlignment: MainAxisAlignment.spaceAround,
    children: [/* 네비게이션 아이템들 */],
  ),
)`}
          rnCode={`<View style={styles.floatingContainer}>
  <View style={styles.floatingNav}>
    {items.map((item, index) => (
      <Pressable style={styles.floatingItem}>
        <Text>{item.icon}</Text>
      </Pressable>
    ))}
  </View>
</View>`}
        >
          <FloatingBottomNav />
        </ExampleSection>

        {/* Example 6: 중앙 버튼이 있는 네비게이션 */}
        <ExampleSection
          title="6. 중앙 FAB가 있는 네비게이션"
          flutterCode={`Scaffold(
  bottomNavigationBar: BottomNavigationBar(
    items: [
      BottomNavigationBarItem(icon: Icon(Icons.home)),
      BottomNavigationBarItem(
        icon: SizedBox.shrink(),  // 빈 공간
        label: '',
      ),
      BottomNavigationBarItem(icon: Icon(Icons.person)),
    ],
  ),
  floatingActionButton: FloatingActionButton(
    onPressed: () {},
    child: Icon(Icons.add),
  ),
  floatingActionButtonLocation:
    FloatingActionButtonLocation.centerDocked,
)`}
          rnCode={`<View style={styles.navWithFab}>
  <View style={styles.bottomNav}>
    <Pressable style={styles.navItem}>
      <Text>🏠</Text>
    </Pressable>

    {/* 중앙 FAB 공간 */}
    <View style={{ width: 56 }} />

    <Pressable style={styles.navItem}>
      <Text>👤</Text>
    </Pressable>
  </View>

  {/* 중앙 FAB */}
  <View style={styles.centerFab}>
    <Text style={styles.fabIcon}>+</Text>
  </View>
</View>`}
        >
          <BottomNavWithCenterFab />
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
            • Flutter BottomNavigationBar → RN의 커스텀 바텀 네비게이션{"\n"}
            • Expo Router Tabs 사용이 가장 권장됨{"\n"}
            • currentIndex → useState로 관리{"\n"}
            • onTap → onPress 핸들러{"\n"}
            • BottomNavigationBarItem → Pressable + View{"\n"}
            • Badge는 position: 'absolute'로 구현{"\n"}
            • SafeAreaView로 홈 인디케이터 영역 처리{"\n"}
            • 커스텀 스타일링은 자유롭게 가능
          </ThemedText>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.navButtonSecondary,
              { borderColor: colors.tint },
              pressed && styles.navButtonPressed,
            ]}
            onPress={() => router.push("/(examples)/appbar-example")}
          >
            <Text style={[styles.navButtonTextSecondary, { color: colors.tint }]}>
              ← 이전: 앱 바
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.navButtonPrimary,
              { backgroundColor: colors.tint },
              pressed && styles.navButtonPressed,
            ]}
            onPress={() => router.push("/(examples)/fab-example")}
          >
            <Text style={styles.navButtonTextPrimary}>
              다음: FAB →
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ===== 재사용 가능한 BottomNav 컴포넌트들 =====

function BasicBottomNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const items = [
    { icon: "🏠", label: "홈" },
    { icon: "🔍", label: "검색" },
    { icon: "👤", label: "프로필" },
  ];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          {items[selectedIndex].label} 탭이 선택되었습니다
        </Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bottomNav}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={styles.navItem}
              onPress={() => setSelectedIndex(index)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: selectedIndex === index ? "#4ECDC4" : "#95A5A6",
                    fontWeight: selectedIndex === index ? "600" : "400",
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function BottomNavWithBadge() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const items = [
    { icon: "🏠", label: "홈", badge: null },
    { icon: "💬", label: "메시지", badge: 3 },
    { icon: "🔔", label: "알림", badge: 12 },
  ];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          {items[selectedIndex].label} 탭
        </Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bottomNav}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={styles.navItem}
              onPress={() => setSelectedIndex(index)}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.badge > 9 ? "9+" : item.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    color: selectedIndex === index ? "#4ECDC4" : "#95A5A6",
                    fontWeight: selectedIndex === index ? "600" : "400",
                  },
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function IconOnlyBottomNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const items = [
    { icon: "🏠" },
    { icon: "🔍" },
    { icon: "❤️" },
    { icon: "👤" },
  ];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          아이콘만 표시되는 컴팩트한 디자인
        </Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bottomNav}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.iconOnlyItem,
                selectedIndex === index && styles.iconOnlyItemActive,
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <Text
                style={[
                  styles.icon,
                  { fontSize: selectedIndex === index ? 28 : 24 },
                ]}
              >
                {item.icon}
              </Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

function ShiftingBottomNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const items = [
    { icon: "🏠", label: "홈" },
    { icon: "🔍", label: "검색" },
    { icon: "❤️", label: "좋아요" },
    { icon: "👤", label: "프로필" },
  ];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          선택된 아이템이 확대됩니다
        </Text>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.bottomNav}>
          {items.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <Pressable
                key={index}
                style={[
                  styles.shiftingItem,
                  isSelected && styles.shiftingItemActive,
                ]}
                onPress={() => setSelectedIndex(index)}
              >
                <Text
                  style={[
                    styles.icon,
                    { fontSize: isSelected ? 28 : 22 },
                  ]}
                >
                  {item.icon}
                </Text>
                {isSelected && (
                  <Text style={[styles.label, { color: "#4ECDC4" }]}>
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

function FloatingBottomNav() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const items = [
    { icon: "🏠" },
    { icon: "🔍" },
    { icon: "❤️" },
    { icon: "👤" },
  ];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          플로팅 스타일 네비게이션
        </Text>
      </View>

      <View style={styles.floatingContainer}>
        <View style={styles.floatingNav}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              style={[
                styles.floatingItem,
                selectedIndex === index && styles.floatingItemActive,
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <Text style={styles.icon}>{item.icon}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

function BottomNavWithCenterFab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          중앙 FAB가 있는 네비게이션
        </Text>
      </View>

      <View style={styles.navWithFabContainer}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.bottomNav}>
            <Pressable
              style={styles.navItem}
              onPress={() => setSelectedIndex(0)}
            >
              <Text style={styles.icon}>🏠</Text>
              <Text
                style={[
                  styles.label,
                  { color: selectedIndex === 0 ? "#4ECDC4" : "#95A5A6" },
                ]}
              >
                홈
              </Text>
            </Pressable>

            {/* 중앙 공간 */}
            <View style={{ width: 56 }} />

            <Pressable
              style={styles.navItem}
              onPress={() => setSelectedIndex(1)}
            >
              <Text style={styles.icon}>👤</Text>
              <Text
                style={[
                  styles.label,
                  { color: selectedIndex === 1 ? "#4ECDC4" : "#95A5A6" },
                ]}
              >
                프로필
              </Text>
            </Pressable>
          </View>
        </SafeAreaView>

        {/* 중앙 FAB */}
        <Pressable style={styles.centerFab}>
          <Text style={styles.fabIcon}>+</Text>
        </Pressable>
      </View>
    </View>
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
    paddingTop: 60,
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
    minHeight: 200,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentText: {
    fontSize: 14,
    textAlign: "center",
  },
  safeArea: {
    backgroundColor: "white",
  },
  // Bottom Navigation
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
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
  },
  iconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
  // Icon Only
  iconOnlyItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
  },
  iconOnlyItemActive: {
    backgroundColor: "rgba(78, 205, 196, 0.1)",
  },
  // Shifting
  shiftingItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    opacity: 0.6,
  },
  shiftingItemActive: {
    flex: 1.5,
    opacity: 1,
  },
  // Floating
  floatingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },
  floatingNav: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 16,
  },
  floatingItemActive: {
    backgroundColor: "rgba(78, 205, 196, 0.2)",
  },
  // Center FAB
  navWithFabContainer: {
    position: "relative",
  },
  centerFab: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    marginLeft: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4ECDC4",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "white",
    fontWeight: "300",
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
  navButtonContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  navButtonPrimary: {},
  navButtonSecondary: {
    borderWidth: 2,
  },
  navButtonPressed: {
    opacity: 0.7,
  },
  navButtonTextPrimary: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  navButtonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
  },
});
