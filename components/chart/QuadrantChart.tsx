/**
 * QuadrantChart - Interactive 4-quadrant scatter chart for character comparison
 * Built with react-native-svg for complete customization
 */

import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, {
  Rect,
  Line,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

import { Character, CharacterPosition, ChartConfig, QuadrantColors } from '@/types/character';
import { getCharacterById } from '@/data/characters';
import { CharacterPoint } from './CharacterPoint';

interface QuadrantChartProps {
  characters: Character[];
  positions: CharacterPosition[];
  config: ChartConfig;
  quadrantColors?: QuadrantColors;
  selectedCharacterId?: string | null;
  onCharacterPress?: (characterId: string) => void;
  onChartPress?: (x: number, y: number) => void;
}

const DEFAULT_QUADRANT_COLORS: QuadrantColors = {
  topLeft: '#FEF3C7',     // Warm yellow - Low ZZZ, High Cool
  topRight: '#D1FAE5',    // Green - High ZZZ, High Cool
  bottomLeft: '#FEE2E2',  // Red - Low ZZZ, Low Cool
  bottomRight: '#DBEAFE', // Blue - High ZZZ, Low Cool
};

export function QuadrantChart({
  characters,
  positions,
  config,
  quadrantColors = DEFAULT_QUADRANT_COLORS,
  selectedCharacterId,
  onCharacterPress,
  onChartPress,
}: QuadrantChartProps) {
  const { width, height, padding } = config;

  // Chart area dimensions (excluding padding)
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const centerX = padding + chartWidth / 2;
  const centerY = padding + chartHeight / 2;

  // Convert data coordinates (0-100) to SVG coordinates
  const toSvgX = useCallback(
    (dataX: number) => padding + (dataX / 100) * chartWidth,
    [padding, chartWidth]
  );

  const toSvgY = useCallback(
    (dataY: number) => padding + ((100 - dataY) / 100) * chartHeight,
    [padding, chartHeight]
  );

  // Convert SVG coordinates to data coordinates
  const toDataCoords = useCallback(
    (svgX: number, svgY: number) => {
      const dataX = ((svgX - padding) / chartWidth) * 100;
      const dataY = 100 - ((svgY - padding) / chartHeight) * 100;
      return {
        x: Math.max(0, Math.min(100, dataX)),
        y: Math.max(0, Math.min(100, dataY)),
      };
    },
    [padding, chartWidth, chartHeight]
  );

  // Handle chart press
  const handleChartPress = useCallback(
    (event: { nativeEvent: { locationX: number; locationY: number } }) => {
      if (onChartPress) {
        const { locationX, locationY } = event.nativeEvent;
        const { x, y } = toDataCoords(locationX, locationY);
        onChartPress(x, y);
      }
    },
    [onChartPress, toDataCoords]
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={handleChartPress}>
        <Svg width={width} height={height}>
          <Defs>
            {/* Gradients for quadrants */}
            <LinearGradient id="gradTopLeft" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={quadrantColors.topLeft} stopOpacity="0.8" />
              <Stop offset="1" stopColor={quadrantColors.topLeft} stopOpacity="0.4" />
            </LinearGradient>
            <LinearGradient id="gradTopRight" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={quadrantColors.topRight} stopOpacity="0.8" />
              <Stop offset="1" stopColor={quadrantColors.topRight} stopOpacity="0.4" />
            </LinearGradient>
            <LinearGradient id="gradBottomLeft" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={quadrantColors.bottomLeft} stopOpacity="0.8" />
              <Stop offset="1" stopColor={quadrantColors.bottomLeft} stopOpacity="0.4" />
            </LinearGradient>
            <LinearGradient id="gradBottomRight" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={quadrantColors.bottomRight} stopOpacity="0.8" />
              <Stop offset="1" stopColor={quadrantColors.bottomRight} stopOpacity="0.4" />
            </LinearGradient>
          </Defs>

          {/* Quadrant backgrounds */}
          <Rect
            x={padding}
            y={padding}
            width={chartWidth / 2}
            height={chartHeight / 2}
            fill="url(#gradTopLeft)"
          />
          <Rect
            x={centerX}
            y={padding}
            width={chartWidth / 2}
            height={chartHeight / 2}
            fill="url(#gradTopRight)"
          />
          <Rect
            x={padding}
            y={centerY}
            width={chartWidth / 2}
            height={chartHeight / 2}
            fill="url(#gradBottomLeft)"
          />
          <Rect
            x={centerX}
            y={centerY}
            width={chartWidth / 2}
            height={chartHeight / 2}
            fill="url(#gradBottomRight)"
          />

          {/* Grid lines */}
          <G opacity={0.3}>
            {[25, 50, 75].map((percent) => (
              <React.Fragment key={percent}>
                <Line
                  x1={toSvgX(percent)}
                  y1={padding}
                  x2={toSvgX(percent)}
                  y2={height - padding}
                  stroke="#666"
                  strokeWidth={percent === 50 ? 2 : 1}
                  strokeDasharray={percent === 50 ? undefined : '4,4'}
                />
                <Line
                  x1={padding}
                  y1={toSvgY(percent)}
                  x2={width - padding}
                  y2={toSvgY(percent)}
                  stroke="#666"
                  strokeWidth={percent === 50 ? 2 : 1}
                  strokeDasharray={percent === 50 ? undefined : '4,4'}
                />
              </React.Fragment>
            ))}
          </G>

          {/* Axis labels with arrows */}
          {/* X-Axis: ZZZ 스러움 (left → right) */}
          <G>
            {/* X-axis arrow line */}
            <Line
              x1={padding + 20}
              y1={height - 20}
              x2={width - padding - 10}
              y2={height - 20}
              stroke="#333"
              strokeWidth={2}
            />
            {/* X-axis arrow head */}
            <Line
              x1={width - padding - 10}
              y1={height - 20}
              x2={width - padding - 18}
              y2={height - 25}
              stroke="#333"
              strokeWidth={2}
            />
            <Line
              x1={width - padding - 10}
              y1={height - 20}
              x2={width - padding - 18}
              y2={height - 15}
              stroke="#333"
              strokeWidth={2}
            />
            {/* X-axis label */}
            <SvgText
              x={centerX}
              y={height - 4}
              fontSize={13}
              fontWeight="600"
              fill="#333"
              textAnchor="middle"
            >
              {config.xAxisLabel.replace(' →', '')}
            </SvgText>
          </G>

          {/* Y-Axis: 멋있음 (bottom → top) */}
          <G>
            {/* Y-axis arrow line */}
            <Line
              x1={20}
              y1={height - padding - 20}
              x2={20}
              y2={padding + 10}
              stroke="#333"
              strokeWidth={2}
            />
            {/* Y-axis arrow head */}
            <Line
              x1={20}
              y1={padding + 10}
              x2={15}
              y2={padding + 18}
              stroke="#333"
              strokeWidth={2}
            />
            <Line
              x1={20}
              y1={padding + 10}
              x2={25}
              y2={padding + 18}
              stroke="#333"
              strokeWidth={2}
            />
            {/* Y-axis label */}
            <SvgText
              x={12}
              y={centerY}
              fontSize={13}
              fontWeight="600"
              fill="#333"
              textAnchor="middle"
              rotation={-90}
              origin={`12, ${centerY}`}
            >
              {config.yAxisLabel.replace('↑ ', '')}
            </SvgText>
          </G>

          {/* Quadrant labels */}
          <SvgText
            x={padding + chartWidth / 4}
            y={padding + chartHeight / 4}
            fontSize={11}
            fill="#666"
            textAnchor="middle"
            opacity={0.7}
          >
            {config.quadrantLabels.topLeft}
          </SvgText>
          <SvgText
            x={centerX + chartWidth / 4}
            y={padding + chartHeight / 4}
            fontSize={11}
            fill="#666"
            textAnchor="middle"
            opacity={0.7}
          >
            {config.quadrantLabels.topRight}
          </SvgText>
          <SvgText
            x={padding + chartWidth / 4}
            y={centerY + chartHeight / 4}
            fontSize={11}
            fill="#666"
            textAnchor="middle"
            opacity={0.7}
          >
            {config.quadrantLabels.bottomLeft}
          </SvgText>
          <SvgText
            x={centerX + chartWidth / 4}
            y={centerY + chartHeight / 4}
            fontSize={11}
            fill="#666"
            textAnchor="middle"
            opacity={0.7}
          >
            {config.quadrantLabels.bottomRight}
          </SvgText>

          {/* Character points - only show placed characters */}
          {positions
            .filter((pos) => pos.isPlaced)
            .map((pos) => {
              const character = getCharacterById(pos.characterId);
              if (!character) return null;

              const isSelected = selectedCharacterId === pos.characterId;
              const svgX = toSvgX(pos.x);
              const svgY = toSvgY(pos.y);

              return (
                <CharacterPoint
                  key={pos.characterId}
                  character={character}
                  position={pos}
                  svgX={svgX}
                  svgY={svgY}
                  isSelected={isSelected}
                  onPress={() => onCharacterPress?.(pos.characterId)}
                />
              );
            })}

          {/* Border */}
          <Rect
            x={padding}
            y={padding}
            width={chartWidth}
            height={chartHeight}
            fill="none"
            stroke="#ccc"
            strokeWidth={2}
          />
        </Svg>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
