<script setup lang="ts">
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { gameState, selectedIndex, paused, boardSize, loadingGameStatus } = storeToRefs(gameStore)
const { newGame, animatedPlace, select, undo } = gameStore
const showNewGameConfirmation = ref(false)

const loading = computed(() => loadingGameStatus.value === 'pending')

onMounted(() => {
  paused.value = false
})

function newGameClick() {
  paused.value = true
  showNewGameConfirmation.value = true
}

function closeConfirmation() {
  paused.value = false
  showNewGameConfirmation.value = false
}

async function newGameConfirmationClick() {
  closeConfirmation()
  await newGame()
}
</script>

<template>
  <div>
    <div>
      <div :class="`game ${paused ? 'paused' : ''} ${loading ? 'loading' : ''}`">
        <div class="header">
          <div style="float: left">
            <h1 class="title">
              Connect 9
            </h1>
            <Button :loading="loading" @click="newGameClick">
              New Game
            </Button>
            <Button :loading="loading" style="margin-left: 10px" :disabled="gameState.previousState === null" @click="undo">
              Undo
            </Button>
          </div>
          <div v-if="loading" class="score-container skeleton" />
          <div v-else class="score-container">
            <!-- <div class="score">
              {{ gameState.score }}
            </div> -->
            <svg viewBox="0 0 140 80" width="100%">
              <Piece
                class="score"
                :value="gameState.highestNumber"
                :x="45" :y="4"
                :width="50"
                :padding="0"
                :radius="6"
              />
              <rect
                fill="var(--game-foreground-color)"
                :rx="2" :ry="2"
                :x="85" :y="32"
                :width="28"
                :height="22"
              />
              <text
                :x="99" :y="44"
                dominant-baseline="middle"
                text-anchor="middle"
                font-size="12"
                fill="white"
                font-style="italic"
              >x{{ gameState.highestNumberCount }}</text>
              <text
                x="50%"
                y="82%"
                dominant-baseline="hanging"
                text-anchor="middle"
                font-size="12"
                fill="var(--game-foreground-color)"
                font-style="italic"
              >{{ gameState.highestNumberMoves }} moves</text>
            </svg>
          </div>
        </div>
        <div style="position: relative;">
          <div v-if="loading" class="loader">
            Loading...
          </div>
          <Board
            :loading="loading"
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
          :loading="loadingGameStatus === 'pending'"
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
    </div>
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
  .game:not(.paused) .button:not(.skeleton):hover {
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
  white-space: nowrap;
}

.game .header .score-container {
  background: var(--game-background-color);
  width: 35%;
  min-width: 100px;
  margin-left: 10px;
  border-radius: 10px;
  align-self: stretch;
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.game .header .score-container.skeleton {
  opacity: 0.5;
  min-height: 80px;
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
