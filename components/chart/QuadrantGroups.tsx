/**
 * QuadrantGroups - Display characters grouped by quadrant
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Character, CharacterPosition } from '@/types/character';
import { getCharacterById } from '@/data/characters';
import { Colors } from '@/constants/theme';
import { shadows } from '@/utils/shadow-utils';

interface QuadrantGroupsProps {
  charactersByQuadrant: {
    topLeft: CharacterPosition[];
    topRight: CharacterPosition[];
    bottomLeft: CharacterPosition[];
    bottomRight: CharacterPosition[];
  };
  quadrantLabels: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
  onCharacterPress?: (characterId: string) => void;
}

interface QuadrantSectionProps {
  title: string;
  color: string;
  positions: CharacterPosition[];
  onCharacterPress?: (characterId: string) => void;
  delay: number;
}

function QuadrantSection({
  title,
  color,
  positions,
  onCharacterPress,
  delay,
}: QuadrantSectionProps) {
  if (positions.length === 0) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(300)}
      style={[styles.section, { borderLeftColor: color }]}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionDot, { backgroundColor: color }]} />
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{positions.length}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.characterList}
      >
        {positions.map((pos) => {
          const character = getCharacterById(pos.characterId);
          if (!character) return null;

          return (
            <Pressable
              key={pos.characterId}
              style={styles.characterChip}
              onPress={() => onCharacterPress?.(pos.characterId)}
            >
              <View
                style={[styles.characterAvatar, { backgroundColor: character.color }]}
              >
                <Text style={styles.avatarText}>{character.name.charAt(0)}</Text>
              </View>
              <Text style={styles.characterName} numberOfLines={1}>
                {character.nameKo || character.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
}

export function QuadrantGroups({
  charactersByQuadrant,
  quadrantLabels,
  onCharacterPress,
}: QuadrantGroupsProps) {
  const hasAnyCharacters =
    charactersByQuadrant.topLeft.length > 0 ||
    charactersByQuadrant.topRight.length > 0 ||
    charactersByQuadrant.bottomLeft.length > 0 ||
    charactersByQuadrant.bottomRight.length > 0;

  if (!hasAnyCharacters) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          캐릭터를 배치하면 여기에 그룹별로 표시됩니다
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>사분면별 캐릭터</Text>

      <QuadrantSection
        title={quadrantLabels.topRight}
        color="#22C55E"
        positions={charactersByQuadrant.topRight}
        onCharacterPress={onCharacterPress}
        delay={0}
      />

      <QuadrantSection
        title={quadrantLabels.topLeft}
        color="#F59E0B"
        positions={charactersByQuadrant.topLeft}
        onCharacterPress={onCharacterPress}
        delay={50}
      />

      <QuadrantSection
        title={quadrantLabels.bottomRight}
        color="#3B82F6"
        positions={charactersByQuadrant.bottomRight}
        onCharacterPress={onCharacterPress}
        delay={100}
      />

      <QuadrantSection
        title={quadrantLabels.bottomLeft}
        color="#EF4444"
        positions={charactersByQuadrant.bottomLeft}
        onCharacterPress={onCharacterPress}
        delay={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.icon,
  },
  characterList: {
    gap: 8,
  },
  characterChip: {
    alignItems: 'center',
    width: 60,
  },
  characterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  characterName: {
    fontSize: 11,
    color: Colors.light.text,
    textAlign: 'center',
  },
  emptyContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: Colors.light.icon,
    textAlign: 'center',
  },
});
