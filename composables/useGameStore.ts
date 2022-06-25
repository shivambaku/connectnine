import type { GameState } from '@prisma/client';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', () => {
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

  return { gameState, newGame, place, select };
});

