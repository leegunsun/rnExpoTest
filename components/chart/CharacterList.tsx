/**
 * CharacterList - Scrollable list of characters for selection
 */

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Character, CharacterPosition } from '@/types/character';
import { Colors } from '@/constants/theme';
import { shadows } from '@/utils/shadow-utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CharacterListProps {
  characters: Character[];
  positions: CharacterPosition[];
  selectedCharacterId: string | null;
  onCharacterSelect: (characterId: string) => void;
  onCharacterReset?: (characterId: string) => void;
}

interface CharacterItemProps {
  character: Character;
  position: CharacterPosition | undefined;
  isSelected: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

function CharacterItem({
  character,
  position,
  isSelected,
  onPress,
  onLongPress,
}: CharacterItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const isPlaced = position?.isPlaced ?? false;

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.characterItem,
        isSelected && styles.characterItemSelected,
        animatedStyle,
      ]}
    >
      {/* Character avatar placeholder */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: character.color },
          isPlaced && styles.avatarPlaced,
        ]}
      >
        <Text style={styles.avatarText}>{character.name.charAt(0)}</Text>
        {isPlaced && (
          <View style={styles.placedBadge}>
            <Text style={styles.placedBadgeText}>✓</Text>
          </View>
        )}
      </View>

      {/* Character info */}
      <View style={styles.characterInfo}>
        <Text style={styles.characterName} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={styles.characterSubtitle} numberOfLines={1}>
          {character.nameKo || character.element}
        </Text>
      </View>

      {/* Rarity stars */}
      <View style={styles.rarityContainer}>
        {character.rarity &&
          Array.from({ length: character.rarity }).map((_, i) => (
            <Text key={i} style={styles.rarityStar}>
              ★
            </Text>
          ))}
      </View>
    </AnimatedPressable>
  );
}

export function CharacterList({
  characters,
  positions,
  selectedCharacterId,
  onCharacterSelect,
  onCharacterReset,
}: CharacterListProps) {
  const getPosition = useCallback(
    (characterId: string) => positions.find((p) => p.characterId === characterId),
    [positions]
  );

  const renderItem: ListRenderItem<Character> = useCallback(
    ({ item }) => (
      <CharacterItem
        character={item}
        position={getPosition(item.id)}
        isSelected={selectedCharacterId === item.id}
        onPress={() => onCharacterSelect(item.id)}
        onLongPress={() => onCharacterReset?.(item.id)}
      />
    ),
    [getPosition, selectedCharacterId, onCharacterSelect, onCharacterReset]
  );

  const keyExtractor = useCallback((item: Character) => item.id, []);

  // Group characters by placement status
  const sortedCharacters = [...characters].sort((a, b) => {
    const aPlaced = getPosition(a.id)?.isPlaced ?? false;
    const bPlaced = getPosition(b.id)?.isPlaced ?? false;
    if (aPlaced === bPlaced) return 0;
    return aPlaced ? 1 : -1; // Unplaced characters first
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>캐릭터 선택</Text>
      <Text style={styles.hint}>탭하여 선택 → 차트를 탭하여 배치</Text>
      <Text style={styles.hint}>길게 누르면 위치 초기화</Text>

      <FlatList
        data={sortedCharacters}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  hint: {
    fontSize: 12,
    color: Colors.light.icon,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  separator: {
    width: 8,
  },
  characterItem: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    width: 80,
    ...shadows.md,
  },
  characterItemSelected: {
    backgroundColor: '#E8F4FD',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarPlaced: {
    opacity: 0.7,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  placedBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  characterInfo: {
    alignItems: 'center',
  },
  characterName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
  },
  characterSubtitle: {
    fontSize: 10,
    color: Colors.light.icon,
    textAlign: 'center',
  },
  rarityContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  rarityStar: {
    fontSize: 8,
    color: '#F59E0B',
  },
});
