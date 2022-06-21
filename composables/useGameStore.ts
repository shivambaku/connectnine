import { defineStore } from 'pinia';

export const useGameStore = defineStore('gameStore', () => {
  const settings = ref({
    boardSize: 5,
    selectorCount: 3,
    randomness: [0.4, 0.33, 0.22, 0.04, 0.01],
  });

  const gameState = ref({
    boardPieces: [],
    selectorPieces: [],
    selectedIndex: 0,
    score: 0,
  });

  const undoState = ref({
    canUndo: false,
    futureSelectorPieces: [],
  });

  const selectedPiece = computed(() => ({
    get() {
      return gameState.value.selectorPieces[gameState.value.selectedIndex];
    },
    set(value) {
      gameState.value.selectorPieces[gameState.value.selectedIndex] = value;
    },
  }));

  const getRandomPiece = () => {
    // if we already know what the future piece should be, then use that
    if (futureSelectorPieces.value[gameState.value.selectedIndex] !== null)
      return futureSelectorPieces.value[gameState.value.selectedIndex];

    // otherwise get a random number for the next piece
    const rand = Math.random();
    let sum = 0;
    for (let i = 0; i < settings.value.randomness.length; i += 1) {
      sum += settings.value.randomness[i];
      if (rand <= sum)
        return i + 1;
    }
    return 0;
  };

  const select = (index) => {
    gameState.value.selectedIndex = index;
  };

  return { gameState, canUndo, futureSelectorPieces };
});
