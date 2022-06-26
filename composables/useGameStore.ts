import type { GameState } from '@prisma/client';
import { onKeyDown, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', () => {
  const gameState = ref({} as GameState);
  const savedGameId = useStorage('gameId', null);

  const newGame = async () => {
    gameState.value = await $fetch('/api/game/new', { method: 'post' });
    savedGameId.value = gameState.value.id;
  };

  const loadGame = async () => {
    gameState.value = await $fetch('/api/game/load', { method: 'post', body: { gameId: savedGameId.value } });
    savedGameId.value = gameState.value.id;
  };

  const place = async (x: number, y: number) => {
    gameState.value
      = await $fetch('/api/game/place', { method: 'post', body: { gameId: gameState.value.id, x, y, selectedIndex: gameState.value.selectedIndex } });
  };

  const select = async (i: number) => {
    gameState.value.selectedIndex = i;
  };

  onKeyDown(['1', '2', '3'], (e) => {
    select(parseInt(e.key) - 1);
  });

  const undo = async () => {
    gameState.value = await $fetch('/api/game/undo', { method: 'post', body: { gameId: gameState.value.id } });
  };

  return { gameState, newGame, loadGame, place, select, undo };
});

