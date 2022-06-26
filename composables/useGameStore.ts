import type { GameState } from '@prisma/client';
import { useStorage } from '@vueuse/core';
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

  window.addEventListener('keydown', (event) => {
    if (!event.defaultPrevented) {
      switch (event.code) {
        case 'Digit1':
          gameState.value.selectedIndex = 0;
          break;
        case 'Digit2':
          gameState.value.selectedIndex = 1;
          break;
        case 'Digit3':
          gameState.value.selectedIndex = 2;
          break;
        default:
          return;
      }
      // consume the event so it doesn't get handled twice
      event.preventDefault();
    }
  }, true);

  return { gameState, newGame, loadGame, place, select };
});

