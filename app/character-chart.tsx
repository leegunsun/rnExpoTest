/**
 * Character Chart Screen
 * Interactive quadrant chart for comparing game character appeal
 */

import React, { useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { Stack } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { QuadrantChart, CharacterList, ChartStats, QuadrantGroups, ChartShareButton } from '@/components/chart';
import { useCharacterChart } from '@/hooks/use-character-chart';
import { ChartConfig } from '@/types/character';
import { Colors } from '@/constants/theme';

export default function CharacterChartScreen() {
  const { width } = useWindowDimensions();
  const chartRef = useRef<View>(null);

  // Chart configuration
  const chartConfig: ChartConfig = useMemo(
    () => ({
      width: Math.min(width - 32, 400),
      height: Math.min(width - 32, 400),
      padding: 40,
      xAxisLabel: '스러움 →',
      yAxisLabel: '↑ 멋있음',
      quadrantLabels: {
        topLeft: '독특함',
        topRight: '완벽함',
        bottomLeft: '평범함',
        bottomRight: '마스터',
      },
    }),
    [width]
  );

  // Use character chart hook
  const {
    characters,
    positions,
    selectedCharacterId,
    selectCharacter,
    placeCharacterAt,
    resetCharacter,
    resetAll,
    stats,
    charactersByQuadrant,
  } = useCharacterChart();

  // Handle chart tap
  const handleChartPress = useCallback(
    (x: number, y: number) => {
      if (selectedCharacterId) {
        placeCharacterAt(x, y);
      }
    },
    [selectedCharacterId, placeCharacterAt]
  );

  // Handle character point tap on chart
  const handleCharacterPress = useCallback(
    (characterId: string) => {
      selectCharacter(characterId);
    },
    [selectCharacter]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Stack.Screen
        options={{
          title: '캐릭터 매력 차트',
          headerShown: true,
          headerStyle: { backgroundColor: '#F8FAFC' },
          headerTitleStyle: { fontWeight: '700' },
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
          <Text style={styles.title}>게임 캐릭터 매력 측정</Text>
          <Text style={styles.subtitle}>
            캐릭터를 선택하고 차트에 배치하여 매력을 비교해보세요
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <ChartStats stats={stats} onReset={resetAll} />
        </Animated.View>

        {/* Chart */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.chartContainer}
        >
          {/* Capture area for sharing */}
          <View ref={chartRef} style={styles.captureArea} collapsable={false}>
            <QuadrantChart
              characters={characters}
              positions={positions}
              config={chartConfig}
              selectedCharacterId={selectedCharacterId}
              onCharacterPress={handleCharacterPress}
              onChartPress={handleChartPress}
            />
          </View>

          {/* Selection indicator */}
          {selectedCharacterId && (
            <Animated.View
              entering={FadeIn.duration(300)}
              style={styles.selectionIndicator}
            >
              <Text style={styles.selectionText}>
                차트를 탭하여 캐릭터 배치
              </Text>
            </Animated.View>
          )}

          {/* Share Button */}
          {stats.placed > 0 && (
            <Animated.View
              entering={FadeIn.delay(300).duration(300)}
              style={styles.shareButtonContainer}
            >
              <ChartShareButton chartRef={chartRef} />
            </Animated.View>
          )}
        </Animated.View>

        {/* Character list */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <CharacterList
            characters={characters}
            positions={positions}
            selectedCharacterId={selectedCharacterId}
            onCharacterSelect={selectCharacter}
            onCharacterReset={resetCharacter}
          />
        </Animated.View>

        {/* Quadrant Groups */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)}>
          <QuadrantGroups
            charactersByQuadrant={charactersByQuadrant}
            quadrantLabels={chartConfig.quadrantLabels}
            onCharacterPress={handleCharacterPress}
          />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.icon,
    lineHeight: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  selectionIndicator: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
  },
  selectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  captureArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 8,
  },
  shareButtonContainer: {
    marginTop: 16,
  },
});
