<script setup lang="ts">
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();
const { gameState, connectionsAnimationData } = storeToRefs(gameStore);
const { newGame, loadGame, place, select, undo } = gameStore;

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
      :pieces="gameState.boardPieces"
      :padding="10"
      :width="400"
      :piece-padding="4"
      :piece-radius="6"
      :connections-animation-data="connectionsAnimationData"
      @place="place"
    />
    <Selector
      :pieces="gameState.selectorPieces"
      :selected-index="gameState.selectedIndex"
      :padding="10"
      :width="200"
      @select="select"
    />
  </div>
</template>

<style scoped>
.game {
  max-width: 400px;
  min-width: 300px;
  margin: 0 auto;
}

.game .header {
  margin: 30px 0px 0px;
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
  background: var(--background-color);
  color: var(--foreground-color);
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
    background: var(--foreground-color);
    color: var(--background-color);
    cursor: pointer;
  }
}

.game .header .score-container {
  background: var(--background-color);
  width: 30%;
  border-radius: 10px;
  position: relative;
}

.game .header .score::before {
  content: 'SCORE';
  color: var(--foreground-color);
  font-size: 14px;
  position: absolute;
  top: -60%;
  left: 0;
  right: 0;
}

.game .header .score {
  color: var(--foreground-color);
  font-size: 34px;
  font-weight: 500;
  position: absolute;
  top: 42%;
  left: 0;
  right: 0;
}
</style>
