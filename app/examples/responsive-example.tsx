/**
 * react-native-size-matters 종합 예제 페이지
 * 모든 API와 사용법을 시각적으로 학습
 */

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  scale,
  verticalScale,
  moderateScale,
  ScaledSheet,
} from 'react-native-size-matters';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ResponsiveExample() {
  const router = useRouter();
  const [selectedFactor, setSelectedFactor] = useState(0.5);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>react-native-size-matters</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 소개 섹션 */}
        <Section title="📱 반응형 스케일링 라이브러리">
          <InfoCard>
            <Text style={styles.infoText}>
              디자인 기준 크기를 설정하고, 다양한 화면 크기에서 자동으로 스케일링되는 UI를
              만들 수 있습니다.
            </Text>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceInfoText}>현재 화면: {SCREEN_WIDTH.toFixed(0)} × {SCREEN_HEIGHT.toFixed(0)}</Text>
              <Text style={styles.deviceInfoText}>기준 크기: 375 × 812</Text>
            </View>
          </InfoCard>
        </Section>

        {/* scale() 예제 */}
        <Section title="1️⃣ scale(size) - 너비 기준">
          <InfoCard>
            <Text style={styles.description}>
              화면 너비를 기준으로 비례하여 스케일링합니다.{'\n'}
              기준: 375px (일반적인 모바일 디자인 기준)
            </Text>
            <CodeBlock>{`import { scale } from 'react-native-size-matters';

const size = scale(100);
// 375px 화면: 100
// 750px 화면: 200`}</CodeBlock>
          </InfoCard>

          <View style={styles.exampleRow}>
            <ExampleBox
              label="scale(50)"
              size={scale(50)}
              color="#3B82F6"
            />
            <ExampleBox
              label="scale(100)"
              size={scale(100)}
              color="#10B981"
            />
            <ExampleBox
              label="scale(150)"
              size={scale(150)}
              color="#F59E0B"
            />
          </View>
        </Section>

        {/* verticalScale() 예제 */}
        <Section title="2️⃣ verticalScale(size) - 높이 기준">
          <InfoCard>
            <Text style={styles.description}>
              화면 높이를 기준으로 비례하여 스케일링합니다.{'\n'}
              기준: 812px
            </Text>
            <CodeBlock>{`import { verticalScale } from 'react-native-size-matters';

const height = verticalScale(100);
// 812px 화면: 100
// 1624px 화면: 200`}</CodeBlock>
          </InfoCard>

          <View style={styles.exampleRow}>
            <ExampleBox
              label="vs(50)"
              size={verticalScale(50)}
              color="#8B5CF6"
              vertical
            />
            <ExampleBox
              label="vs(100)"
              size={verticalScale(100)}
              color="#EC4899"
              vertical
            />
            <ExampleBox
              label="vs(150)"
              size={verticalScale(150)}
              color="#EF4444"
              vertical
            />
          </View>
        </Section>

        {/* moderateScale() 예제 */}
        <Section title="3️⃣ moderateScale(size, factor) - 적당한 스케일링">
          <InfoCard>
            <Text style={styles.description}>
              과도한 확대/축소를 방지하는 스케일링입니다.{'\n'}
              factor로 스케일 정도를 조절할 수 있습니다. (기본값: 0.5)
            </Text>
            <CodeBlock>{`import { moderateScale } from 'react-native-size-matters';

const fontSize = moderateScale(16);
// factor = 0.5 (기본값)

const iconSize = moderateScale(24, 0.3);
// factor = 0.3 (더 보수적)`}</CodeBlock>
          </InfoCard>

          {/* Factor 선택 */}
          <View style={styles.factorSelector}>
            {[0, 0.3, 0.5, 0.7, 1].map((factor) => (
              <TouchableOpacity
                key={factor}
                onPress={() => setSelectedFactor(factor)}
                style={[
                  styles.factorButton,
                  selectedFactor === factor && styles.factorButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.factorButtonText,
                    selectedFactor === factor && styles.factorButtonTextActive,
                  ]}
                >
                  {factor}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.exampleRow}>
            <View style={styles.moderateExample}>
              <Text
                style={{
                  fontSize: moderateScale(16, selectedFactor),
                  color: '#1F2937',
                  fontWeight: '600',
                }}
              >
                16px
              </Text>
              <Text style={styles.exampleLabel}>
                ms(16, {selectedFactor})
              </Text>
            </View>
            <View style={styles.moderateExample}>
              <Text
                style={{
                  fontSize: moderateScale(24, selectedFactor),
                  color: '#1F2937',
                  fontWeight: '600',
                }}
              >
                24px
              </Text>
              <Text style={styles.exampleLabel}>
                ms(24, {selectedFactor})
              </Text>
            </View>
            <View style={styles.moderateExample}>
              <Text
                style={{
                  fontSize: moderateScale(32, selectedFactor),
                  color: '#1F2937',
                  fontWeight: '600',
                }}
              >
                32px
              </Text>
              <Text style={styles.exampleLabel}>
                ms(32, {selectedFactor})
              </Text>
            </View>
          </View>

          <InfoCard backgroundColor="#FEF3C7">
            <Text style={styles.tipText}>
              💡 <Text style={{ fontWeight: '700' }}>사용 가이드:</Text>{'\n'}
              • factor = 0: 고정 크기 (스케일링 없음){'\n'}
              • factor = 0.3: 아이콘 (보수적 스케일링){'\n'}
              • factor = 0.5: 폰트 (기본 스케일링){'\n'}
              • factor = 1.0: 완전한 스케일링 (scale과 동일)
            </Text>
          </InfoCard>
        </Section>

        {/* ScaledSheet 예제 */}
        <Section title="4️⃣ ScaledSheet - 자동 스케일링">
          <InfoCard>
            <Text style={styles.description}>
              StyleSheet.create 대신 ScaledSheet.create를 사용하면{'\n'}
              특수 문법으로 자동 스케일링할 수 있습니다.
            </Text>
            <CodeBlock>{`import { ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  box: {
    width: '100@s',    // scale(100)
    height: '200@vs',  // verticalScale(200)
    padding: '16@ms',  // moderateScale(16)
    fontSize: '16@ms0.3' // moderateScale(16, 0.3)
  }
});`}</CodeBlock>
          </InfoCard>

          <View style={scaledStyles.scaledExample}>
            <Text style={scaledStyles.scaledText}>ScaledSheet Example</Text>
          </View>

          <InfoCard backgroundColor="#DBEAFE">
            <Text style={styles.tipText}>
              📝 <Text style={{ fontWeight: '700' }}>문법:</Text>{'\n'}
              • @s → scale(){'\n'}
              • @vs → verticalScale(){'\n'}
              • @ms → moderateScale(){'\n'}
              • @ms0.3 → moderateScale(size, 0.3)
            </Text>
          </InfoCard>
        </Section>

        {/* Before/After 비교 */}
        <Section title="5️⃣ Before vs After - 비교">
          <InfoCard>
            <Text style={styles.description}>
              고정 크기와 반응형 크기의 차이를 비교해보세요.
            </Text>
          </InfoCard>

          {/* Before - 고정 크기 */}
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>❌ Before (고정 크기)</Text>
            <View style={styles.comparisonBox}>
              <View style={styles.fixedBox}>
                <Text style={styles.fixedText}>Title</Text>
                <Text style={styles.fixedBody}>
                  모든 화면에서 동일한 크기입니다.{'\n'}
                  작은 화면에서는 너무 크고,{'\n'}
                  큰 화면에서는 너무 작을 수 있습니다.
                </Text>
              </View>
            </View>
          </View>

          {/* After - 반응형 */}
          <View style={styles.comparisonContainer}>
            <Text style={styles.comparisonTitle}>✅ After (반응형)</Text>
            <View style={styles.comparisonBox}>
              <View style={styles.responsiveBox}>
                <Text style={styles.responsiveText}>Title</Text>
                <Text style={styles.responsiveBody}>
                  화면 크기에 따라 자동으로 조정됩니다.{'\n'}
                  모든 디바이스에서 일관된 경험을 제공합니다.
                </Text>
              </View>
            </View>
          </View>
        </Section>

        {/* 실전 예제 */}
        <Section title="6️⃣ 실전 예제 - 카드 컴포넌트">
          <InfoCard>
            <Text style={styles.description}>
              실제 프로젝트에서 사용하는 반응형 카드 컴포넌트입니다.
            </Text>
          </InfoCard>

          <View style={styles.practicalCard}>
            <View style={styles.practicalHeader}>
              <View style={styles.practicalAvatar}>
                <Text style={styles.practicalAvatarText}>👤</Text>
              </View>
              <View style={styles.practicalHeaderText}>
                <Text style={styles.practicalName}>사용자 이름</Text>
                <Text style={styles.practicalTime}>2시간 전</Text>
              </View>
            </View>
            <Text style={styles.practicalContent}>
              react-native-size-matters를 사용하면 모든 화면 크기에서 완벽한 UI를 만들 수
              있습니다! 🎉
            </Text>
            <View style={styles.practicalFooter}>
              <TouchableOpacity style={styles.practicalButton}>
                <Text style={styles.practicalButtonText}>❤️ 좋아요</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.practicalButton}>
                <Text style={styles.practicalButtonText}>💬 댓글</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.practicalButton}>
                <Text style={styles.practicalButtonText}>🔗 공유</Text>
              </TouchableOpacity>
            </View>
          </View>

          <CodeBlock>{`const styles = StyleSheet.create({
  card: {
    padding: ms(16),
    borderRadius: ms(12),
  },
  avatar: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
  },
  name: {
    fontSize: ms(16),
    fontWeight: '600',
  },
  content: {
    fontSize: ms(14),
    lineHeight: ms(20),
  },
});`}</CodeBlock>
        </Section>

        {/* 권장 사항 */}
        <Section title="📚 사용 권장 사항">
          <InfoCard backgroundColor="#F3E8FF">
            <Text style={styles.tipText}>
              <Text style={{ fontWeight: '700' }}>✨ Best Practices:</Text>{'\n\n'}
              1. <Text style={{ fontWeight: '600' }}>폰트 크기</Text>: moderateScale() 사용{'\n'}
              {'   '}• fontSize: ms(16){'\n'}
              {'   '}• lineHeight: ms(24){'\n\n'}
              2. <Text style={{ fontWeight: '600' }}>아이콘 크기</Text>: moderateScale(size, 0.3){'\n'}
              {'   '}• 과도한 확대 방지{'\n\n'}
              3. <Text style={{ fontWeight: '600' }}>고정 너비/높이</Text>: scale() / verticalScale(){'\n'}
              {'   '}• 버튼, 카드, 컨테이너{'\n\n'}
              4. <Text style={{ fontWeight: '600' }}>Spacing</Text>: 선택적 스케일링{'\n'}
              {'   '}• padding/margin은 고정값도 괜찮음
            </Text>
          </InfoCard>
        </Section>

        {/* 하단 여백 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/** 섹션 컴포넌트 */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

/** 정보 카드 컴포넌트 */
function InfoCard({
  children,
  backgroundColor = '#F9FAFB',
}: {
  children: React.ReactNode;
  backgroundColor?: string;
}) {
  return (
    <View style={[styles.infoCard, { backgroundColor }]}>
      {children}
    </View>
  );
}

/** 코드 블록 컴포넌트 */
function CodeBlock({ children }: { children: string }) {
  return (
    <View style={styles.codeBlock}>
      <Text style={styles.codeText}>{children}</Text>
    </View>
  );
}

/** 예제 박스 컴포넌트 */
function ExampleBox({
  label,
  size,
  color,
  vertical = false,
}: {
  label: string;
  size: number;
  color: string;
  vertical?: boolean;
}) {
  return (
    <View style={styles.exampleBoxContainer}>
      <View
        style={[
          styles.exampleBox,
          {
            width: vertical ? 60 : size,
            height: vertical ? size : 60,
            backgroundColor: color,
          },
        ]}
      >
        <Text style={styles.exampleBoxText}>{size.toFixed(0)}</Text>
      </View>
      <Text style={styles.exampleLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1F2937',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  deviceInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  deviceInfoText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#1F2937',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  codeText: {
    fontSize: 12,
    color: '#F9FAFB',
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  exampleBoxContainer: {
    alignItems: 'center',
  },
  exampleBox: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exampleLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  factorSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginVertical: 16,
  },
  factorButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  factorButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  factorButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  factorButtonTextActive: {
    color: '#FFFFFF',
  },
  moderateExample: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    minWidth: 80,
  },
  tipText: {
    fontSize: 13,
    color: '#1F2937',
    lineHeight: 20,
  },
  comparisonContainer: {
    marginBottom: 16,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  comparisonBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  fixedBox: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fixedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  fixedBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  responsiveBox: {
    padding: moderateScale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  responsiveText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: moderateScale(8),
  },
  responsiveBody: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    lineHeight: moderateScale(20),
  },
  practicalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  practicalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: moderateScale(12),
  },
  practicalAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: moderateScale(12),
  },
  practicalAvatarText: {
    fontSize: moderateScale(20, 0.3),
  },
  practicalHeaderText: {
    flex: 1,
  },
  practicalName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: '#1F2937',
  },
  practicalTime: {
    fontSize: moderateScale(12),
    color: '#9CA3AF',
    marginTop: 2,
  },
  practicalContent: {
    fontSize: moderateScale(14),
    color: '#4B5563',
    lineHeight: moderateScale(20),
    marginBottom: moderateScale(12),
  },
  practicalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: moderateScale(12),
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  practicalButton: {
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(16),
  },
  practicalButtonText: {
    fontSize: moderateScale(13),
    color: '#6B7280',
    fontWeight: '500',
  },
});

// ScaledSheet 예제
const scaledStyles = ScaledSheet.create({
  scaledExample: {
    width: '200@s',
    height: '100@vs',
    backgroundColor: '#8B5CF6',
    borderRadius: '12@ms',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '12@ms',
  },
  scaledText: {
    fontSize: '16@ms',
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
