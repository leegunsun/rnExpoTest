/**
 * CharacterPoint - Animated character marker for QuadrantChart
 */

import React, { useEffect } from 'react';
import { Circle, G, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Character, CharacterPosition } from '@/types/character';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface CharacterPointProps {
  character: Character;
  position: CharacterPosition;
  svgX: number;
  svgY: number;
  isSelected: boolean;
  onPress?: () => void;
}

export function CharacterPoint({
  character,
  position,
  svgX,
  svgY,
  isSelected,
  onPress,
}: CharacterPointProps) {
  // Animation values
  const scale = useSharedValue(1);
  const ringScale = useSharedValue(1);
  const opacity = useSharedValue(position.isPlaced ? 1 : 0.5);

  // Update opacity when placement changes
  useEffect(() => {
    opacity.value = withSpring(position.isPlaced ? 1 : 0.5);
  }, [position.isPlaced, opacity]);

  // Pulse animation for selected character
  useEffect(() => {
    if (isSelected) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 800, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 800, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      scale.value = withSpring(1);
      ringScale.value = withSpring(1);
    }
  }, [isSelected, scale, ringScale]);

  // Animated props for main circle
  const animatedCircleProps = useAnimatedProps(() => ({
    r: (position.isPlaced ? 14 : 10) * scale.value,
    opacity: opacity.value,
  }));

  // Animated props for selection ring
  const animatedRingProps = useAnimatedProps(() => ({
    r: 18 * ringScale.value,
    opacity: 0.5 / ringScale.value,
  }));

  const baseRadius = position.isPlaced ? 14 : 10;

  return (
    <G>
      {/* Selection ring */}
      {isSelected && (
        <AnimatedCircle
          cx={svgX}
          cy={svgY}
          animatedProps={animatedRingProps}
          fill="none"
          stroke={character.color}
          strokeWidth={3}
        />
      )}

      {/* Character dot with border */}
      <AnimatedCircle
        cx={svgX}
        cy={svgY}
        animatedProps={animatedCircleProps}
        fill={character.color}
        stroke="#fff"
        strokeWidth={2}
        onPress={onPress}
      />

      {/* Character initial */}
      <SvgText
        x={svgX}
        y={svgY + 4}
        fontSize={position.isPlaced ? 10 : 8}
        fontWeight="bold"
        fill="#fff"
        textAnchor="middle"
        onPress={onPress}
      >
        {character.name.charAt(0)}
      </SvgText>
    </G>
  );
}
