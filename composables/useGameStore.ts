import type { GameState } from '@prisma/client';
import { onKeyDown, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { ConnectionAnimationDataPart } from '~~/interfaces';

export const useGameStore = defineStore('gameStore', () => {
  const gameState = ref({} as GameState);
  const selectedIndex = ref(0);
  const savedGameId = useStorage('gameId', null);
  const awaitingServer = ref(false);
  let animating = false;
  let placedCachedGameState: string = null;

  const newGame = async () => {
    if (animating || awaitingServer.value)
      return;

    awaitingServer.value = true;
    gameState.value = await $fetch('/api/game/new', { method: 'post' });
    savedGameId.value = gameState.value.id;
    awaitingServer.value = false;
  };

  const loadGame = async () => {
    gameState.value = await $fetch('/api/game/load', { method: 'post', body: { gameId: savedGameId.value } });
    savedGameId.value = gameState.value.id;
  };

  const place = async (x: number, y: number) => {
    if (awaitingServer)
      return;

    awaitingServer.value = true;
    gameState.value
      = await $fetch('/api/game/place', { method: 'post', body: { gameId: gameState.value.id, x, y, selectedIndex: selectedIndex.value } });
    awaitingServer.value = false;
  };

  const placeInCacheIfAnimating = async (x: number, y: number) => {
    awaitingServer.value = true;
    const response = await $fetch('/api/game/place', { method: 'post', body: { gameId: gameState.value.id, x, y, selectedIndex: selectedIndex.value } });

    // if animating then save the response and set it after animation is done
    // if done after animation then directly set the gameState
    if (animating)
      placedCachedGameState = JSON.stringify(response);
    else
      gameState.value = response;
    awaitingServer.value = false;
  };

  const setPlacedCacheToGameState = () => {
    if (placedCachedGameState !== null) {
      gameState.value = JSON.parse(placedCachedGameState);
      placedCachedGameState = null;
    }
  };

  const select = async (i: number) => {
    selectedIndex.value = i;
  };

  onKeyDown(['1', '2', '3'], (e) => {
    select(parseInt(e.key) - 1);
  });

  const undo = async () => {
    if (animating || awaitingServer.value)
      return;

    awaitingServer.value = true;
    gameState.value = JSON.parse(gameState.value.previousState);
    gameState.value = await $fetch('/api/game/undo', { method: 'post', body: { gameId: gameState.value.id } });
    awaitingServer.value = false;
  };

  const boardSize = computed(() => {
    return Math.sqrt(gameState.value.boardPieces.length);
  });

  const sameValue = (index: number, value: number) => {
    return gameState.value.boardPieces[index] === value;
  };

  const outOfBounds = (x: number, y: number) => {
    return x < 0 || x >= boardSize.value || y < 0 || y >= boardSize.value;
  };

  const xytoi = (x: number, y: number) => {
    return y * boardSize.value + x;
  };

  const checkConnections = (x: number, y: number, value: number, visited: Set<number>, connectionAnimationDataPart: Array<ConnectionAnimationDataPart>, parentX: number, parentY: number, level: number) => {
    const index = xytoi(x, y);
    if (!outOfBounds(x, y) && sameValue(index, value) && !visited.has(index)) {
      visited.add(index);

      if (level !== 0) {
        connectionAnimationDataPart.push({
          x,
          y,
          parentX,
          parentY,
          level,
          value,
        });
      }

      checkConnections(x, y + 1, value, visited, connectionAnimationDataPart, x, y, level + 1);
      checkConnections(x + 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1);
      checkConnections(x, y - 1, value, visited, connectionAnimationDataPart, x, y, level + 1);
      checkConnections(x - 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1);
    }
  };

  const animatedPlaceHelper = (x: number, y: number, value: number, animateConnection) => {
    const index = xytoi(x, y);

    // place the piece
    gameState.value.boardPieces[index] = value;

    // check if connections were formed
    const visited = new Set<number>();
    const connectionAnimationData = new Array<ConnectionAnimationDataPart>();
    checkConnections(x, y, value, visited, connectionAnimationData, x, y, 0);

    // a connection was formed
    if (visited.size >= 3) {
      gameState.value.score += visited.size * value;

      // besides the placed piece set all visited pieces to empty
      visited.delete(index);
      for (const visitedIndex of visited)
        gameState.value.boardPieces[visitedIndex] = 0;

      gameState.value.boardPieces[index] = value + 1;

      animateConnection(connectionAnimationData, () => {
        animatedPlaceHelper(x, y, value + 1, animateConnection);
      });
    }
    else {
      animating = false;
      // set real placed data received from the server
      setPlacedCacheToGameState();
    }
  };

  const animatedPlace = (x: number, y: number, animateConnection) => {
    if (animating || awaitingServer.value)
      return;

    animating = true;

    placeInCacheIfAnimating(x, y);

    // run the game logic on the client as well while waiting for the real response
    animatedPlaceHelper(x, y, gameState.value.selectorPieces[selectedIndex.value], animateConnection);

    // set the selected piece to the next piece
    gameState.value.selectorPieces[selectedIndex.value] = gameState.value.futureSelectorPieces[selectedIndex.value];
  };

  return { gameState, selectedIndex, boardSize, newGame, loadGame, place, select, undo, animatedPlace };
});

