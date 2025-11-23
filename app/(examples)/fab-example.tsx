/**
 * Floating Action Button Examples for Flutter Developers
 *
 * Flutter의 FloatingActionButton을 React Native Expo에서 구현하는 방법
 *
 * Flutter FloatingActionButton 개념:
 * - FloatingActionButton: 플로팅 액션 버튼
 * - FloatingActionButton.extended: 확장형 FAB (아이콘 + 텍스트)
 * - FloatingActionButton.small: 작은 FAB
 * - FloatingActionButton.large: 큰 FAB
 * - floatingActionButtonLocation: 위치 지정 (centerFloat, endFloat, etc.)
 * - onPressed: 클릭 핸들러
 * - backgroundColor: 배경색
 * - foregroundColor: 아이콘/텍스트 색상
 * - elevation: 그림자 깊이
 * - shape: 모양 (원형, 둥근 사각형 등)
 *
 * React Native Expo 구현 방법:
 * - position: 'absolute'를 사용한 절대 위치
 * - Pressable 컴포넌트로 상호작용
 * - shadowOffset, shadowOpacity로 그림자 효과
 * - Animated API로 애니메이션 추가
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

export default function FabExampleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Example 1: 기본 FAB */}
        <ExampleSection
          title="1. 기본 FAB (원형)"
          flutterCode={`FloatingActionButton(
  onPressed: () {
    // 액션 실행
  },
  child: Icon(Icons.add),
  backgroundColor: Colors.blue,
  elevation: 6,
)`}
          rnCode={`<Pressable
  style={styles.fab}
  onPress={() => {
    // 액션 실행
  }}
>
  <Text style={styles.fabIcon}>+</Text>
</Pressable>

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});`}
        >
          <BasicFabExample />
        </ExampleSection>

        {/* Example 2: 확장형 FAB (Extended FAB) */}
        <ExampleSection
          title="2. 확장형 FAB (아이콘 + 텍스트)"
          flutterCode={`FloatingActionButton.extended(
  onPressed: () {},
  icon: Icon(Icons.add),
  label: Text('작성하기'),
  backgroundColor: Colors.purple,
)`}
          rnCode={`<Pressable style={styles.extendedFab}>
  <Text style={styles.fabIcon}>✏️</Text>
  <Text style={styles.fabLabel}>작성하기</Text>
</Pressable>

const styles = StyleSheet.create({
  extendedFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#9B59B6',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});`}
        >
          <ExtendedFabExample />
        </ExampleSection>

        {/* Example 3: 크기 변형 (Small, Regular, Large) */}
        <ExampleSection
          title="3. 크기 변형"
          flutterCode={`// Small FAB
FloatingActionButton.small(
  onPressed: () {},
  child: Icon(Icons.add, size: 20),
)

// Regular FAB
FloatingActionButton(
  onPressed: () {},
  child: Icon(Icons.add),
)

// Large FAB
FloatingActionButton.large(
  onPressed: () {},
  child: Icon(Icons.add, size: 36),
)`}
          rnCode={`// Small (40x40)
<Pressable style={[styles.fab, {
  width: 40,
  height: 40,
  borderRadius: 20,
}]}>
  <Text style={{ fontSize: 20 }}>+</Text>
</Pressable>

// Regular (56x56)
<Pressable style={styles.fab}>
  <Text style={{ fontSize: 28 }}>+</Text>
</Pressable>

// Large (96x96)
<Pressable style={[styles.fab, {
  width: 96,
  height: 96,
  borderRadius: 48,
}]}>
  <Text style={{ fontSize: 40 }}>+</Text>
</Pressable>`}
        >
          <SizeFabExample />
        </ExampleSection>

        {/* Example 4: 위치 변형 */}
        <ExampleSection
          title="4. 위치 변형"
          flutterCode={`Scaffold(
  floatingActionButton: FloatingActionButton(...),
  floatingActionButtonLocation:
    FloatingActionButtonLocation.centerFloat,
    // 또는
    // .startFloat
    // .endFloat
    // .centerDocked
)`}
          rnCode={`// 오른쪽 하단 (기본)
bottom: 16, right: 16

// 왼쪽 하단
bottom: 16, left: 16

// 중앙 하단
bottom: 16, left: '50%', marginLeft: -28

// 우측 중앙
top: '50%', marginTop: -28, right: 16`}
        >
          <PositionFabExample />
        </ExampleSection>

        {/* Example 5: 스피드 다이얼 (Speed Dial) */}
        <ExampleSection
          title="5. 스피드 다이얼 (여러 액션)"
          flutterCode={`// Flutter에서는 커스텀 구현 필요
// 패키지: flutter_speed_dial

SpeedDial(
  icon: Icons.menu,
  activeIcon: Icons.close,
  children: [
    SpeedDialChild(
      child: Icon(Icons.photo),
      label: '사진',
    ),
    SpeedDialChild(
      child: Icon(Icons.video),
      label: '동영상',
    ),
  ],
)`}
          rnCode={`const [isOpen, setIsOpen] = useState(false);

<View>
  {/* Sub FABs */}
  {isOpen && (
    <>
      <Pressable style={[styles.fab, {
        bottom: 88,
        transform: [{ scale: 0.8 }]
      }]}>
        <Text>📷</Text>
      </Pressable>
      <Pressable style={[styles.fab, {
        bottom: 152,
        transform: [{ scale: 0.8 }]
      }]}>
        <Text>🎥</Text>
      </Pressable>
    </>
  )}

  {/* Main FAB */}
  <Pressable
    style={styles.fab}
    onPress={() => setIsOpen(!isOpen)}
  >
    <Text>{isOpen ? '✕' : '☰'}</Text>
  </Pressable>
</View>`}
        >
          <SpeedDialFabExample />
        </ExampleSection>

        {/* Example 6: 애니메이션 FAB */}
        <ExampleSection
          title="6. 애니메이션 효과"
          flutterCode={`FloatingActionButton(
  onPressed: () {
    // 애니메이션 트리거
    _controller.forward();
  },
  child: AnimatedIcon(
    icon: AnimatedIcons.play_pause,
    progress: _controller,
  ),
)`}
          rnCode={`// Pressable의 pressed 상태 활용
<Pressable
  style={({ pressed }) => [
    styles.fab,
    {
      transform: [
        { scale: pressed ? 0.9 : 1 }
      ]
    }
  ]}
>
  <Text>▶️</Text>
</Pressable>

// 또는 Animated API 사용
import { Animated } from 'react-native';`}
        >
          <AnimatedFabExample />
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
            • Flutter FloatingActionButton → position: 'absolute'{"\n"}
            • onPressed → onPress 이벤트{"\n"}
            • elevation → shadowOffset, shadowOpacity, elevation{"\n"}
            • FloatingActionButton.extended → flexDirection: 'row'{"\n"}
            • floatingActionButtonLocation → bottom, left, right 조합{"\n"}
            • 스피드 다이얼은 조건부 렌더링으로 구현{"\n"}
            • Animated API로 부드러운 애니메이션 추가 가능{"\n"}
            • 원형은 borderRadius를 width/height의 절반으로 설정
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
            onPress={() => router.push("/(examples)/bottom-nav-example")}
          >
            <Text style={[styles.navButtonTextSecondary, { color: colors.tint }]}>
              ← 이전: 바텀 네비게이션
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              styles.navButtonPrimary,
              { backgroundColor: colors.tint },
              pressed && styles.navButtonPressed,
            ]}
            onPress={() => router.push("/(examples)/combined-example")}
          >
            <Text style={styles.navButtonTextPrimary}>
              다음: 통합 예제 →
            </Text>
          </Pressable>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// ===== 재사용 가능한 FAB 컴포넌트들 =====

function BasicFabExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          기본 원형 FAB
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { backgroundColor: "#4ECDC4" },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={() => Alert.alert("FAB", "버튼을 클릭했습니다!")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>
    </View>
  );
}

function ExtendedFabExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          확장형 FAB (아이콘 + 텍스트)
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.extendedFab,
          { backgroundColor: "#9B59B6" },
          pressed && { transform: [{ scale: 0.95 }] },
        ]}
        onPress={() => Alert.alert("Extended FAB", "작성하기 클릭!")}
      >
        <Text style={styles.fabIcon}>✏️</Text>
        <Text style={styles.fabLabel}>작성하기</Text>
      </Pressable>
    </View>
  );
}

function SizeFabExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          세 가지 크기: Small, Regular, Large
        </Text>
      </View>

      {/* Small FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#E74C3C",
            bottom: 16,
            left: 16,
          },
        ]}
      >
        <Text style={{ fontSize: 18, color: "white" }}>+</Text>
      </Pressable>

      {/* Regular FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            backgroundColor: "#3498DB",
            bottom: 16,
            left: "50%",
            marginLeft: -28,
          },
        ]}
      >
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      {/* Large FAB */}
      <Pressable
        style={[
          styles.fab,
          {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "#2ECC71",
            bottom: 16,
            right: 16,
          },
        ]}
      >
        <Text style={{ fontSize: 36, color: "white" }}>+</Text>
      </Pressable>
    </View>
  );
}

function PositionFabExample() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          다양한 위치에 배치된 FAB
        </Text>
      </View>

      {/* 좌측 하단 */}
      <Pressable
        style={[
          styles.fab,
          styles.fabSmall,
          { backgroundColor: "#E74C3C", bottom: 16, left: 16 },
        ]}
      >
        <Text style={styles.fabIconSmall}>1</Text>
      </Pressable>

      {/* 중앙 하단 */}
      <Pressable
        style={[
          styles.fab,
          styles.fabSmall,
          { backgroundColor: "#3498DB", bottom: 16, left: "50%", marginLeft: -20 },
        ]}
      >
        <Text style={styles.fabIconSmall}>2</Text>
      </Pressable>

      {/* 우측 하단 */}
      <Pressable
        style={[
          styles.fab,
          styles.fabSmall,
          { backgroundColor: "#2ECC71", bottom: 16, right: 16 },
        ]}
      >
        <Text style={styles.fabIconSmall}>3</Text>
      </Pressable>

      {/* 우측 중앙 */}
      <Pressable
        style={[
          styles.fab,
          styles.fabSmall,
          { backgroundColor: "#F39C12", top: "50%", marginTop: -20, right: 16 },
        ]}
      >
        <Text style={styles.fabIconSmall}>4</Text>
      </Pressable>
    </View>
  );
}

function SpeedDialFabExample() {
  const [isOpen, setIsOpen] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          {isOpen
            ? "서브 액션이 표시되었습니다"
            : "메뉴를 눌러 액션을 펼쳐보세요"}
        </Text>
      </View>

      {/* Overlay */}
      {isOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        />
      )}

      {/* Sub FABs */}
      {isOpen && (
        <>
          <View style={styles.speedDialItem}>
            <Text style={styles.speedDialLabel}>동영상</Text>
            <Pressable
              style={[
                styles.fab,
                styles.fabSmall,
                { backgroundColor: "#9B59B6", bottom: 160, right: 16 },
              ]}
              onPress={() => {
                Alert.alert("Speed Dial", "동영상 선택!");
                setIsOpen(false);
              }}
            >
              <Text style={styles.fabIconSmall}>🎥</Text>
            </Pressable>
          </View>

          <View style={styles.speedDialItem}>
            <Text style={[styles.speedDialLabel, { bottom: 104 }]}>사진</Text>
            <Pressable
              style={[
                styles.fab,
                styles.fabSmall,
                { backgroundColor: "#E74C3C", bottom: 96, right: 16 },
              ]}
              onPress={() => {
                Alert.alert("Speed Dial", "사진 선택!");
                setIsOpen(false);
              }}
            >
              <Text style={styles.fabIconSmall}>📷</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Main FAB */}
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: isOpen ? "#95A5A6" : "#4ECDC4",
            transform: [
              { rotate: isOpen ? "45deg" : "0deg" },
              { scale: pressed ? 0.9 : 1 },
            ],
          },
        ]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.fabIcon}>{isOpen ? "✕" : "☰"}</Text>
      </Pressable>
    </View>
  );
}

function AnimatedFabExample() {
  const [isPlaying, setIsPlaying] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.exampleContainer, { backgroundColor: colors.card }]}>
      <View style={styles.content}>
        <Text style={[styles.contentText, { color: colors.text }]}>
          {isPlaying ? "재생 중..." : "일시정지"}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: isPlaying ? "#E74C3C" : "#2ECC71",
            transform: [{ scale: pressed ? 0.85 : 1 }],
          },
        ]}
        onPress={() => setIsPlaying(!isPlaying)}
      >
        <Text style={styles.fabIcon}>{isPlaying ? "⏸" : "▶️"}</Text>
      </Pressable>
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
    fontSize: 10,
    fontFamily: "monospace",
    lineHeight: 15,
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
    minHeight: 250,
    position: "relative",
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
  // FAB 스타일
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
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
  fabSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  fabIconSmall: {
    fontSize: 18,
    color: "white",
  },
  // Extended FAB
  extendedFab: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Speed Dial
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  speedDialItem: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  speedDialLabel: {
    position: "absolute",
    bottom: 168,
    right: 64,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    fontSize: 12,
    fontWeight: "600",
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
