import type { GameState } from '@prisma/client';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', () => {
  const settings = ref({
    boardSize: 5,
    selectorCount: 3,
    randomness: [0.4, 0.33, 0.22, 0.04, 0.01],
  });

  const gameState = ref({} as GameState);

  const newGame = async () => {
    gameState.value = await $fetch('/api/game/new', { method: 'post' });
  };

  const place = async (x: number, y: number) => {
    gameState.value
      = await $fetch('/api/game/place', { method: 'post', body: { gameId: gameState.value.id, x, y, selectedIndex: gameState.value.selectedIndex } });
  };

  const select = async (i: number) => {
    gameState.value.selectedIndex = i;
  };

  return { settings, gameState, newGame, place, select };
});

