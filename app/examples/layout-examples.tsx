/**
 * Layout Examples for Flutter Developers
 *
 * Flutter 개발자를 위한 React Native Expo 레이아웃 예제
 *
 * 주요 매핑:
 * - Column → View with flexDirection: 'column'
 * - Row → View with flexDirection: 'row'
 * - Flexible/Expanded → flex 속성
 * - Stack → View with position 또는 기본 레이어링
 * - Container → View with StyleSheet
 */

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function LayoutExamplesScreen() {
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
              ← 뒤로
            </Text>
          </Pressable>
          <ThemedText type="title" style={styles.title}>
            레이아웃 예제
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Flutter → React Native Expo
          </ThemedText>
        </View>

        {/*테스트 컴포넌트 */}
        <View
          style={{
            position: "relative",
            margin: 20,
          }}
        >
          {/* 빨간 박스 - Text로 크기 자동 결정 */}
          <View
            style={{
              padding: 20, // ← 패딩 추가
              backgroundColor: "red",
            }}
          >
            <Text style={{ color: "white" }}>빨간 박스</Text>
          </View>

          {/* 파란 박스 */}
          <View
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              padding: 15, // ← 패딩 추가
              backgroundColor: "blue",
            }}
          >
            <Text style={{ color: "white" }}>파란 박스</Text>
          </View>
        </View>

        {/* Example 1: Column (세로 배열) */}
        <ExampleSection
          title="1. Column (세로 배열)"
          flutterCode={`Column(
  mainAxisAlignment: MainAxisAlignment.center,
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('첫 번째'),
    Text('두 번째'),
    Text('세 번째'),
  ],
)`}
          rnCode={`<View style={{
  flexDirection: 'column',  // 기본값
  justifyContent: 'center',
  alignItems: 'flex-start',
}}>
  <Text>첫 번째</Text>
  <Text>두 번째</Text>
  <Text>세 번째</Text>
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View
              style={{
                flexDirection: "column", // 세로 배열 (기본값)
                justifyContent: "center",
                alignItems: "flex-start",
                padding: 16,
              }}
            >
              <Text style={[styles.exampleText, { color: colors.text }]}>
                첫 번째
              </Text>
              <Text style={[styles.exampleText, { color: colors.text }]}>
                두 번째
              </Text>
              <Text style={[styles.exampleText, { color: colors.text }]}>
                세 번째
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 2: Row (가로 배열) */}
        <ExampleSection
          title="2. Row (가로 배열)"
          flutterCode={`Row(
  mainAxisAlignment: MainAxisAlignment.spaceAround,
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Text('A'),
    Text('B'),
    Text('C'),
  ],
)`}
          rnCode={`<View style={{
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
}}>
  <Text>A</Text>
  <Text>B</Text>
  <Text>C</Text>
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View
              style={{
                flexDirection: "row", // 가로 배열
                justifyContent: "space-around",
                alignItems: "center",
                padding: 16,
              }}
            >
              <Text style={[styles.exampleText, { color: colors.text }]}>
                A
              </Text>
              <Text style={[styles.exampleText, { color: colors.text }]}>
                B
              </Text>
              <Text style={[styles.exampleText, { color: colors.text }]}>
                C
              </Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 3: Flexible & Expanded (유연한 공간 분배) */}
        <ExampleSection
          title="3. Flexible & Expanded"
          flutterCode={`Row(
  children: [
    Flexible(
      flex: 1,
      child: Container(color: Colors.red),
    ),
    Flexible(
      flex: 2,
      child: Container(color: Colors.blue),
    ),
    Expanded(  // flex: 1과 동일
      child: Container(color: Colors.green),
    ),
  ],
)`}
          rnCode={`<View style={{ flexDirection: 'row' }}>
  <View style={{ flex: 1, backgroundColor: 'red' }} />
  <View style={{ flex: 2, backgroundColor: 'blue' }} />
  <View style={{ flex: 1, backgroundColor: 'green' }} />
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View style={{ flexDirection: "row", height: 60 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#FF6B6B",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.whiteText}>flex: 1</Text>
              </View>
              <View
                style={{
                  flex: 2,
                  backgroundColor: "#4ECDC4",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.whiteText}>flex: 2</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#95E1D3",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.whiteText}>flex: 1</Text>
              </View>
            </View>
          </View>
        </ExampleSection>

        {/* Example 4: Stack (겹치기) */}
        <ExampleSection
          title="4. Stack (겹치기)"
          flutterCode={`Stack(
  children: [
    Container(
      width: 100,
      height: 100,
      color: Colors.red,
    ),
    Positioned(
      top: 20,
      left: 20,
      child: Container(
        width: 60,
        height: 60,
        color: Colors.blue,
      ),
    ),
  ],
)`}
          rnCode={`<View style={{ position: 'relative' }}>
  <View style={{
    width: 100,
    height: 100,
    backgroundColor: 'red',
  }} />
  <View style={{
    position: 'absolute',
    top: 20,
    left: 20,
    width: 60,
    height: 60,
    backgroundColor: 'blue',
  }} />
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View
              style={{
                position: "relative",
                width: 120,
                height: 120,
                margin: 16,
              }}
            >
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#FF6B6B",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  width: 60,
                  height: 60,
                  backgroundColor: "#4ECDC4",
                }}
              />
            </View>
          </View>
        </ExampleSection>

        {/* Example 5: Container with Padding & Margin */}
        <ExampleSection
          title="5. Container (Padding & Margin)"
          flutterCode={`Container(
  margin: EdgeInsets.all(16),
  padding: EdgeInsets.all(20),
  decoration: BoxDecoration(
    color: Colors.blue,
    borderRadius: BorderRadius.circular(8),
  ),
  child: Text('Hello'),
)`}
          rnCode={`<View style={{
  margin: 16,
  padding: 20,
  backgroundColor: 'blue',
  borderRadius: 8,
}}>
  <Text>Hello</Text>
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View
              style={{
                margin: 16,
                padding: 20,
                backgroundColor: "#4ECDC4",
                borderRadius: 8,
              }}
            >
              <Text style={styles.whiteText}>Hello with Padding & Margin</Text>
            </View>
          </View>
        </ExampleSection>

        {/* Example 6: Alignment Options */}
        <ExampleSection
          title="6. Alignment Options"
          flutterCode={`// mainAxisAlignment 옵션들:
// - start, end, center
// - spaceBetween, spaceAround, spaceEvenly

Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [...],
)`}
          rnCode={`// justifyContent 옵션들:
// - flex-start, flex-end, center
// - space-between, space-around, space-evenly

<View style={{
  flexDirection: 'row',
  justifyContent: 'space-between',
}}>
  {/* children */}
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View style={{ padding: 16 }}>
              <Text style={[styles.label, { color: colors.text }]}>
                space-between:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
              </View>

              <Text style={[styles.label, { color: colors.text }]}>
                space-around:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: 16,
                }}
              >
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
              </View>

              <Text style={[styles.label, { color: colors.text }]}>
                space-evenly:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                }}
              >
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
                <View style={styles.smallBox} />
              </View>
            </View>
          </View>
        </ExampleSection>

        {/* Example 7: Nested Layout */}
        <ExampleSection
          title="7. Nested Layout (중첩 레이아웃)"
          flutterCode={`Column(
  children: [
    Row(
      children: [
        Expanded(child: Container(...)),
        Expanded(child: Container(...)),
      ],
    ),
    Row(
      children: [
        Flexible(flex: 2, child: Container(...)),
        Flexible(flex: 1, child: Container(...)),
      ],
    ),
  ],
)`}
          rnCode={`<View style={{ flexDirection: 'column' }}>
  <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 1 }} />
    <View style={{ flex: 1 }} />
  </View>
  <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 2 }} />
    <View style={{ flex: 1 }} />
  </View>
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View style={{ flexDirection: "column", padding: 16 }}>
              {/* First Row */}
              <View
                style={{ flexDirection: "row", height: 60, marginBottom: 8 }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#FF6B6B",
                    marginRight: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.whiteText}>1:1</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#4ECDC4",
                    marginLeft: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.whiteText}>1:1</Text>
                </View>
              </View>
              {/* Second Row */}
              <View style={{ flexDirection: "row", height: 60 }}>
                <View
                  style={{
                    flex: 2,
                    backgroundColor: "#95E1D3",
                    marginRight: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.whiteText}>2:1</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#F38181",
                    marginLeft: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.whiteText}>2:1</Text>
                </View>
              </View>
            </View>
          </View>
        </ExampleSection>

        {/* Example 8: Spacer */}
        <ExampleSection
          title="8. Spacer (빈 공간)"
          flutterCode={`Row(
  children: [
    Text('Left'),
    Spacer(),  // 남은 공간 차지
    Text('Right'),
  ],
)`}
          rnCode={`<View style={{ flexDirection: 'row' }}>
  <Text>Left</Text>
  <View style={{ flex: 1 }} />  {/* 빈 공간 */}
  <Text>Right</Text>
</View>`}
        >
          <View style={[styles.exampleBox, { backgroundColor: colors.card }]}>
            <View
              style={{
                flexDirection: "row",
                padding: 16,
              }}
            >
              <Text style={[styles.exampleText, { color: colors.text }]}>
                Left
              </Text>
              <View style={{ flex: 1 }} />
              <Text style={[styles.exampleText, { color: colors.text }]}>
                Right
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
            • Column → flexDirection: 'column' (기본값){"\n"}• Row →
            flexDirection: 'row'{"\n"}• Flexible/Expanded → flex: 숫자{"\n"}•
            mainAxisAlignment → justifyContent{"\n"}• crossAxisAlignment →
            alignItems{"\n"}• Stack → position: 'relative' + 'absolute'{"\n"}•
            Container → View + StyleSheet{"\n"}• Spacer → View with flex: 1
          </ThemedText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ThemedView>
  );
}

// Example Section Component
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
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
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
    fontSize: 14,
    opacity: 0.7,
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
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
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
  exampleBox: {
    borderRadius: 8,
    overflow: "hidden",
  },
  exampleText: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 4,
  },
  whiteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  smallBox: {
    width: 40,
    height: 40,
    backgroundColor: "#4ECDC4",
    borderRadius: 4,
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
    fontSize: 14,
    lineHeight: 22,
  },
});
