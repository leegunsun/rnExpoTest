/**
 * Mock character data for ZZZ-style game
 * 30+ characters with unique IDs, names, and colors
 */

import { Character, CharacterPosition } from '@/types/character';

// Character element colors
const ELEMENT_COLORS = {
  fire: '#FF6B4A',
  ice: '#4ECDC4',
  electric: '#A855F7',
  physical: '#F59E0B',
  ether: '#EC4899',
  wind: '#22C55E',
} as const;

export const CHARACTERS: Character[] = [
  // Fire Element
  { id: 'char_01', name: 'Ember', nameKo: '엠버', element: 'fire', rarity: 5, color: ELEMENT_COLORS.fire },
  { id: 'char_02', name: 'Blaze', nameKo: '블레이즈', element: 'fire', rarity: 4, color: '#FF8A65' },
  { id: 'char_03', name: 'Phoenix', nameKo: '피닉스', element: 'fire', rarity: 5, color: '#FF5722' },
  { id: 'char_04', name: 'Ash', nameKo: '애쉬', element: 'fire', rarity: 4, color: '#E64A19' },
  { id: 'char_05', name: 'Vulcan', nameKo: '벌칸', element: 'fire', rarity: 5, color: '#D84315' },

  // Ice Element
  { id: 'char_06', name: 'Frost', nameKo: '프로스트', element: 'ice', rarity: 5, color: ELEMENT_COLORS.ice },
  { id: 'char_07', name: 'Glacier', nameKo: '글레이셔', element: 'ice', rarity: 4, color: '#80DEEA' },
  { id: 'char_08', name: 'Crystal', nameKo: '크리스탈', element: 'ice', rarity: 5, color: '#26C6DA' },
  { id: 'char_09', name: 'Winter', nameKo: '윈터', element: 'ice', rarity: 4, color: '#00BCD4' },
  { id: 'char_10', name: 'Aurora', nameKo: '오로라', element: 'ice', rarity: 5, color: '#00ACC1' },

  // Electric Element
  { id: 'char_11', name: 'Volt', nameKo: '볼트', element: 'electric', rarity: 5, color: ELEMENT_COLORS.electric },
  { id: 'char_12', name: 'Spark', nameKo: '스파크', element: 'electric', rarity: 4, color: '#B388FF' },
  { id: 'char_13', name: 'Thunder', nameKo: '썬더', element: 'electric', rarity: 5, color: '#7C4DFF' },
  { id: 'char_14', name: 'Storm', nameKo: '스톰', element: 'electric', rarity: 4, color: '#651FFF' },
  { id: 'char_15', name: 'Lightning', nameKo: '라이트닝', element: 'electric', rarity: 5, color: '#6200EA' },

  // Physical Element
  { id: 'char_16', name: 'Steel', nameKo: '스틸', element: 'physical', rarity: 5, color: ELEMENT_COLORS.physical },
  { id: 'char_17', name: 'Titan', nameKo: '타이탄', element: 'physical', rarity: 4, color: '#FFB74D' },
  { id: 'char_18', name: 'Crusher', nameKo: '크러셔', element: 'physical', rarity: 5, color: '#FFA726' },
  { id: 'char_19', name: 'Breaker', nameKo: '브레이커', element: 'physical', rarity: 4, color: '#FF9800' },
  { id: 'char_20', name: 'Hammer', nameKo: '해머', element: 'physical', rarity: 5, color: '#FB8C00' },

  // Ether Element
  { id: 'char_21', name: 'Mystic', nameKo: '미스틱', element: 'ether', rarity: 5, color: ELEMENT_COLORS.ether },
  { id: 'char_22', name: 'Shadow', nameKo: '섀도우', element: 'ether', rarity: 4, color: '#F48FB1' },
  { id: 'char_23', name: 'Phantom', nameKo: '팬텀', element: 'ether', rarity: 5, color: '#EC407A' },
  { id: 'char_24', name: 'Specter', nameKo: '스펙터', element: 'ether', rarity: 4, color: '#E91E63' },
  { id: 'char_25', name: 'Wraith', nameKo: '레이스', element: 'ether', rarity: 5, color: '#D81B60' },

  // Wind Element
  { id: 'char_26', name: 'Gale', nameKo: '게일', element: 'wind', rarity: 5, color: ELEMENT_COLORS.wind },
  { id: 'char_27', name: 'Breeze', nameKo: '브리즈', element: 'wind', rarity: 4, color: '#81C784' },
  { id: 'char_28', name: 'Cyclone', nameKo: '사이클론', element: 'wind', rarity: 5, color: '#66BB6A' },
  { id: 'char_29', name: 'Zephyr', nameKo: '제피르', element: 'wind', rarity: 4, color: '#4CAF50' },
  { id: 'char_30', name: 'Typhoon', nameKo: '태풍', element: 'wind', rarity: 5, color: '#43A047' },

  // Additional characters
  { id: 'char_31', name: 'Nova', nameKo: '노바', element: 'fire', rarity: 5, color: '#FF7043' },
  { id: 'char_32', name: 'Zero', nameKo: '제로', element: 'ice', rarity: 5, color: '#29B6F6' },
  { id: 'char_33', name: 'Pulse', nameKo: '펄스', element: 'electric', rarity: 4, color: '#9575CD' },
  { id: 'char_34', name: 'Knight', nameKo: '나이트', element: 'physical', rarity: 5, color: '#FFCA28' },
  { id: 'char_35', name: 'Void', nameKo: '보이드', element: 'ether', rarity: 5, color: '#CE93D8' },
];

/**
 * Generate initial placeholder positions for all characters
 * Characters are distributed across the chart in a scattered pattern
 */
export function generateInitialPositions(): CharacterPosition[] {
  return CHARACTERS.map((char, index) => {
    // Create a pseudo-random but deterministic distribution
    const row = Math.floor(index / 7);
    const col = index % 7;

    // Distribute across the chart with some variation
    const baseX = 10 + (col * 12) + (row % 2) * 6;
    const baseY = 10 + (row * 15) + (col % 2) * 5;

    return {
      characterId: char.id,
      x: Math.min(95, Math.max(5, baseX + Math.sin(index) * 5)),
      y: Math.min(95, Math.max(5, baseY + Math.cos(index) * 5)),
      isPlaced: false,
    };
  });
}

/**
 * Get character by ID
 */
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS.find(char => char.id === id);
}

/**
 * Get characters by element
 */
export function getCharactersByElement(element: Character['element']): Character[] {
  return CHARACTERS.filter(char => char.element === element);
}
