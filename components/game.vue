<script setup lang="ts">
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();
const { gameState, selectedIndex } = storeToRefs(gameStore);
const { newGame, loadGame, undo } = gameStore;

await loadGame();
</script>

<template>
  <div class="game">
    <div class="header">
      <div style="float: left">
        <h1 class="title">
          Connect 9
        </h1>
        <div class="button" @click="newGame">
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
    />
    <Selector
      :selected-index="selectedIndex"
      :padding="10"
      :width="200"
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

.game .header .button {
  background: var(--game-background-color);
  color: var(--game-foreground-color);
  padding: 8px 15px;
  border-radius: 10px;
  text-transform: lowercase;
  font-style: italic;
  float: left;
}

.game .header .button.disabled {
  opacity: 0.7;
  pointer-events:none;
}

@media(hover: hover) and (pointer: fine) {
  .game .header .button:hover {
    background: var(--game-foreground-color);
    color: var(--game-background-color);
    cursor: pointer;
  }
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

.rules p {
  font-size: 15px;
  margin-top: 5px;
  font-weight: 200;
}
</style>
