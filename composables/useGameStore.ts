import { onKeyDown, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { Filter } from 'bad-words';
import type { ClientGameState, ClientPlayer, ConnectionAnimationDataPart } from '~~/interfaces';

export const useGameStore = defineStore('gameStore', () => {
  const gameState = ref({} as ClientGameState);
  const selectedIndex = ref(0);
  const paused = ref(false);
  const playerId = useStorage<string>('playerId', null);
  const currentName = ref('guest');
  const awaitingServer = ref(false);
  const filter = new Filter();
  const { status: loadingGameStatus, refresh: load } = useLazyFetch('/api/game/load',
    {
      method: 'POST',
      body: { playerId: playerId.value },
      onResponse({ response }) {
        const clientPlayer: ClientPlayer = response._data;
        playerId.value = clientPlayer.id;
        currentName.value = clientPlayer.currentName;
        gameState.value = clientPlayer.currentGameState;
        return response._data;
      },
    });
  let animating = false;
  let placedCachedGameState: string | null = null;

  // const load = async () => {
  //   const clientPlayer = await $fetch('/api/game/load', { method: 'post', body: { playerId: playerId.value } });
  //   playerId.value = clientPlayer.id;
  //   currentName.value = clientPlayer.currentName;
  //   gameState.value = clientPlayer.currentGameState;
  // };

  async function newGame() {
    if (animating || awaitingServer.value)
      return;

    awaitingServer.value = true;
    gameState.value = await $fetch('/api/game/new', { method: 'post', body: { playerId: playerId.value } });
    awaitingServer.value = false;
  };

  const place = async (x: number, y: number) => {
    if (awaitingServer.value)
      return;

    awaitingServer.value = true;
    gameState.value
      = await $fetch('/api/game/place', { method: 'post', body: { playerId: playerId.value, x, y, selectedIndex: selectedIndex.value } });
    awaitingServer.value = false;
  };

  const placeInCacheIfAnimating = async (x: number, y: number) => {
    awaitingServer.value = true;
    const response = await $fetch('/api/game/place', { method: 'post', body: { playerId: playerId.value, x, y, selectedIndex: selectedIndex.value } });

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
    if (paused.value)
      return;
    select(Number.parseInt(e.key) - 1);
  });

  const undo = async () => {
    if (animating || awaitingServer.value || paused.value)
      return;

    awaitingServer.value = true;
    gameState.value = gameState.value.previousState ? JSON.parse(gameState.value.previousState) : gameState.value;
    gameState.value = await $fetch('/api/game/undo', { method: 'post', body: { playerId: playerId.value } });
    awaitingServer.value = false;
  };

  const boardSize = computed(() => {
    if (!gameState.value.boardPieces)
      return 5;

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

  const animatedPlaceHelper = (x: number, y: number, value: number, animateConnection: any) => {
    const index = xytoi(x, y);

    // place the piece
    gameState.value.boardPieces[index] = value;

    // check if connections were formed
    const visited = new Set<number>();
    const connectionAnimationData = new Array<ConnectionAnimationDataPart>();
    checkConnections(x, y, value, visited, connectionAnimationData, x, y, 0);

    // a connection was formed
    if (visited.size >= 3) {
      gameState.value.score += visited.size * value * 10;

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

  const animatedPlace = (x: number, y: number, animateConnection: any) => {
    if (animating || awaitingServer.value)
      return;

    animating = true;

    placeInCacheIfAnimating(x, y);

    // run the game logic on the client as well while waiting for the real response
    animatedPlaceHelper(x, y, gameState.value.selectorPieces[selectedIndex.value], animateConnection);

    // set the selected piece to the next piece
    gameState.value.selectorPieces[selectedIndex.value] = gameState.value.nextSelectorPiece;
  };

  const registerName = async (name: string) => {
    if (filter.isProfane(name))
      return false;

    currentName.value = name;
    await $fetch('/api/game/registername', { method: 'post', body: { playerId: playerId.value, name: currentName.value } });
    return true;
  };

  return { gameState, selectedIndex, paused, boardSize, registeredName: currentName, loadingGameStatus, load, newGame, place, select, undo, animatedPlace, registerName };
});
