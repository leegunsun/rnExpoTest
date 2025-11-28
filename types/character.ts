/**
 * Character types for the Quadrant Chart feature
 */

export interface Character {
  id: string;
  name: string;
  nameKo?: string;
  element?: CharacterElement;
  rarity?: number;
  color: string;
}

export interface CharacterPosition {
  characterId: string;
  x: number; // 0-100 scale (ZZZ-ness)
  y: number; // 0-100 scale (Coolness)
  isPlaced: boolean;
}

export interface ChartConfig {
  width: number;
  height: number;
  padding: number;
  xAxisLabel: string;
  yAxisLabel: string;
  quadrantLabels: {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
  };
}

export type CharacterElement =
  | 'fire'
  | 'ice'
  | 'electric'
  | 'physical'
  | 'ether'
  | 'wind';

export interface QuadrantColors {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}
