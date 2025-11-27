/**
 * Custom hook for managing character chart state and interactions
 */

import { useState, useCallback, useMemo } from 'react';
import { CharacterPosition } from '@/types/character';
import { CHARACTERS, generateInitialPositions } from '@/data/characters';

interface UseCharacterChartOptions {
  initialPositions?: CharacterPosition[];
}

export function useCharacterChart(options: UseCharacterChartOptions = {}) {
  // Character positions state
  const [positions, setPositions] = useState<CharacterPosition[]>(
    options.initialPositions || generateInitialPositions()
  );

  // Currently selected character for placement
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  // Characters list
  const characters = useMemo(() => CHARACTERS, []);

  // Get position by character ID
  const getPositionById = useCallback(
    (characterId: string) => positions.find((p) => p.characterId === characterId),
    [positions]
  );

  // Select a character for placement
  const selectCharacter = useCallback((characterId: string | null) => {
    setSelectedCharacterId(characterId);
  }, []);

  // Place selected character at specific coordinates
  const placeCharacterAt = useCallback(
    (x: number, y: number) => {
      if (!selectedCharacterId) return;

      setPositions((prev) =>
        prev.map((pos) =>
          pos.characterId === selectedCharacterId
            ? { ...pos, x, y, isPlaced: true }
            : pos
        )
      );

      // Auto-deselect after placement
      setSelectedCharacterId(null);
    },
    [selectedCharacterId]
  );

  // Update a specific character's position
  const updatePosition = useCallback(
    (characterId: string, x: number, y: number, isPlaced?: boolean) => {
      setPositions((prev) =>
        prev.map((pos) =>
          pos.characterId === characterId
            ? { ...pos, x, y, isPlaced: isPlaced ?? pos.isPlaced }
            : pos
        )
      );
    },
    []
  );

  // Reset a character to unplaced state
  const resetCharacter = useCallback((characterId: string) => {
    const initialPositions = generateInitialPositions();
    const initialPos = initialPositions.find((p) => p.characterId === characterId);

    if (initialPos) {
      setPositions((prev) =>
        prev.map((pos) =>
          pos.characterId === characterId
            ? { ...pos, x: initialPos.x, y: initialPos.y, isPlaced: false }
            : pos
        )
      );
    }
  }, []);

  // Reset all characters
  const resetAll = useCallback(() => {
    setPositions(generateInitialPositions());
    setSelectedCharacterId(null);
  }, []);

  // Get statistics
  const stats = useMemo(() => {
    const placed = positions.filter((p) => p.isPlaced).length;
    const total = positions.length;
    return {
      placed,
      total,
      remaining: total - placed,
      percentage: Math.round((placed / total) * 100),
    };
  }, [positions]);

  // Get placed characters by quadrant
  const charactersByQuadrant = useMemo(() => {
    const quadrants = {
      topLeft: [] as CharacterPosition[],
      topRight: [] as CharacterPosition[],
      bottomLeft: [] as CharacterPosition[],
      bottomRight: [] as CharacterPosition[],
    };

    // Only include placed characters
    positions
      .filter((pos) => pos.isPlaced)
      .forEach((pos) => {
        if (pos.x < 50 && pos.y >= 50) quadrants.topLeft.push(pos);
        else if (pos.x >= 50 && pos.y >= 50) quadrants.topRight.push(pos);
        else if (pos.x < 50 && pos.y < 50) quadrants.bottomLeft.push(pos);
        else quadrants.bottomRight.push(pos);
      });

    return quadrants;
  }, [positions]);

  return {
    characters,
    positions,
    selectedCharacterId,
    selectCharacter,
    placeCharacterAt,
    updatePosition,
    resetCharacter,
    resetAll,
    getPositionById,
    stats,
    charactersByQuadrant,
  };
}
