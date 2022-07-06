<script setup lang="ts">
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();
const { gameState, selectedIndex, paused, boardSize } = storeToRefs(gameStore);
const { newGame, loadGame, animatedPlace, select, undo } = gameStore;
const showNewGameConfirmation = ref(false);

onMounted(() => {
  paused.value = false;
});

const newGameClick = () => {
  paused.value = true;
  showNewGameConfirmation.value = true;
};

const closeConfirmation = () => {
  paused.value = false;
  showNewGameConfirmation.value = false;
};

const newGameConfirmationClick = () => {
  closeConfirmation();
  newGame();
};

await loadGame();
</script>

<template>
  <div :class="`game ${paused ? 'paused' : ''}`">
    <div class="header">
      <div style="float: left">
        <h1 class="title">
          Connect 9
        </h1>
        <Button @click="newGameClick">
          New Game
        </Button>
        <Button ml-10px :disabled="gameState.previousState === null" @click="undo">
          Undo
        </Button>
      </div>
      <div class="score-container">
        <div class="score">
          {{ gameState.score }}
        </div>
      </div>
    </div>
    <div position="relative">
      <Board
        :padding="10"
        :width="400"
        :piece-padding="4"
        :piece-radius="6"
        :board-size="boardSize"
        :pieces="gameState.boardPieces"
        :unclickable="paused"
        @animated-place="animatedPlace"
      />
      <div
        v-show="showNewGameConfirmation"
        class="confirmation-overlay"
      >
        <Confirmation
          text="Start new game?"
          @yes="newGameConfirmationClick"
          @no="closeConfirmation"
        />
      </div>
    </div>
    <Selector
      :padding="10"
      :width="200"
      :selected-index="selectedIndex"
      :pieces="gameState.selectorPieces"
      :unclickable="paused"
      @select="select"
    />
  </div>
  <div class="rules">
    <h4>How to Play</h4>
    <p>
      Select one of the three available numbers and place it in an empty spot.
      <br>
      Connect three or more of the same adjacent numbers to get a higher number.
    </p>
  </div>
</template>

<style scoped>
.game {
  max-width: 400px;
  min-width: 300px;
  margin: 0 auto;
}

.game .button {
  background: var(--game-background-color);
  color: var(--game-foreground-color);
}

@media(hover: hover) and (pointer: fine) {
  .game:not(.paused) .button:hover {
    background: var(--game-foreground-color);
    color: var(--game-background-color);
    cursor: pointer;
  }

  .game.paused .button:hover {
    cursor: default;
  }
}

.game .header {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.game .header .title {
  letter-spacing: 2px;
  font-size: 38px;
  margin: 5px 0px 10px;
}

.game .header .score-container {
  background: var(--game-background-color);
  width: 30%;
  border-radius: 10px;
  position: relative;
}

.game .header .score::before {
  content: 'SCORE';
  color: var(--game-foreground-color);
  font-size: 14px;
  position: absolute;
  top: -60%;
  left: 0;
  right: 0;
}

.game .header .score {
  color: var(--game-foreground-color);
  font-size: 30px;
  font-weight: 500;
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
}

@media screen and (max-width: 400px) {
  .game .header .score {
    font-size: 28px;
  }
}

@media screen and (max-width: 350px) {
  .game .header .score {
    font-size: 24px;
  }
}

.game .confirmation-overlay {
  position: absolute;
  width: 62.5%;
  height: 36%;
  top: 32%;
  left: 18.75%;
}

.rules h4 {
  margin-top: 30px;
  margin-bottom: 0px;
  font-size: 18px;
}

@media screen and (max-width: 550px) {
  .rules br {
    display: none;
  }
}

.rules p {
  font-size: 15px;
  font-weight: 200;
  margin: 5px;
}
</style>
