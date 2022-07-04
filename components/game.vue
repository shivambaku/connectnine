<script setup lang="ts">
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();
const { gameState, selectedIndex, boardSize } = storeToRefs(gameStore);
const { newGame, loadGame, animatedPlace, select, undo } = gameStore;
const showNewGameConfirmation = ref(false);

await loadGame();
</script>

<template>
  <div class="game">
    <div class="header">
      <div style="float: left">
        <h1 class="title">
          Connect 9
        </h1>
        <div class="button" @click="showNewGameConfirmation = true">
          New Game
        </div>
        <div
          :class="`button ${gameState.previousState !== null ? '' : 'disabled'}`"
          style="margin-left: 10px"
          @click="undo"
        >
          Undo
        </div>
      </div>
      <div class="score-container">
        <div class="score">
          {{ gameState.score }}
        </div>
      </div>
    </div>
    <Board
      :padding="10"
      :width="400"
      :piece-padding="4"
      :piece-radius="6"
      :board-size="boardSize"
      :pieces="gameState.boardPieces"
      @animated-place="animatedPlace"
    >
      <template #overlay>
        <Confirmation
          :x="100"
          :y="100"
          :width="200"
          :padding="50"
          text="Are you sure?"
          @yes="newGame"
          @no="showNewGameConfirmation = false"
        />
      </template>
    </Board>
    <Selector
      :padding="10"
      :width="200"
      :selected-index="selectedIndex"
      :pieces="gameState.selectorPieces"
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

@media(hover: hover) and (pointer: fine) {
  .game .button:hover {
    background: var(--game-foreground-color);
    color: var(--game-background-color);
    cursor: pointer;
  }
}

.game .button {
  background: var(--game-background-color);
  color: var(--game-foreground-color);
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
  font-size: 34px;
  font-weight: 500;
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
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
  margin-top: 5px;
  font-weight: 200;
  margin-left: 5px;
  margin-right: 5px;
}
</style>
