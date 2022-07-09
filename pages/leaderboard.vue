<script setup lang="ts">
import { storeToRefs } from 'pinia';

const leaderboardStore = useLeaderboardStore();
const { leaderboard } = storeToRefs(leaderboardStore);
const { getTopTen } = leaderboardStore;
const expandedLeaderboardInfo = ref(-1);

const expand = (i: number) => {
  if (expandedLeaderboardInfo.value === i)
    expandedLeaderboardInfo.value = -1;
  else
    expandedLeaderboardInfo.value = i;
};

await getTopTen();
</script>

<template>
  <div>
    <h1 class="title">
      Leaderboard
    </h1>
    <div class="leaderboard">
      <div class="leaderboard-row">
        <div class="leaderboard-header">
          <div style="text-align: left;">
            Name
          </div>
          <div>
            Score
          </div>
        </div>
      </div>
      <div
        v-for="(leaderboardInfo, i) in leaderboard"
        :key="`leaderboardInfo${i}`"
        class="leaderboard-row"
      >
        <div class="leaderboard-rank">
          {{ i + 1 }}
        </div>
        <div class="leaderboard-info" @click="expand(i)">
          <div style="text-align: left;">
            {{ leaderboardInfo.name === null ? 'guest' : leaderboardInfo.name }}
          </div>
          <div>
            {{ leaderboardInfo.score }}
          </div>
          <div
            v-if="expandedLeaderboardInfo === i"
            class="leaderboard-info-board"
          >
            <Board
              :padding="10"
              :width="400"
              :piece-padding="4"
              :piece-radius="6"
              :board-size="5"
              :unclickable="true"
              :pieces="leaderboardInfo.boardPieces"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  letter-spacing: 2px;
  font-size: 38px;
  margin: 5px 0px 10px;
}

.leaderboard {
  max-width: 400px;
  min-width: 300px;
  padding: 20px 0px;
  height: auto;
  margin: 0 auto;
  background: var(--game-background-color);
  color: var(--game-foreground-color);
  font-weight: 400;
  font-size: 14px;
  text-anchor: middle;
  border-radius: 10px;
}

@media screen and (max-width: 400px) {
  .leaderboard {
    font-size: 12px;
  }
}

.leaderboard-row {
  margin: 5px 15px;
  display: grid;
  gap: 10px;
  grid-template-columns: 42px auto;
}

.leaderboard-header {
  grid-column: 2;
  padding: 0px 20px;
  font-weight: 800;
  display: grid;
  grid-template-columns: 80% auto;
}

.leaderboard-rank {
  border-radius: 6px;
  background: rgba(31, 120, 180, 0.2);
  padding: 10px;
  width: 22px;
  height: 22px;
  line-height: 22px;
}

.leaderboard-info {
  padding: 10px 20px;
  border-radius: 6px;
  background: rgba(31, 120, 180, 0.2);
  display: grid;
  grid-template-columns: 80% auto;
  align-items: center;
}

@media(hover: hover) and (pointer: fine) {
  .leaderboard-info:hover {
    background: rgba(31, 120, 180, 0.5);
    cursor: pointer;
  }
}

.leaderboard-info-board {
  grid-column: 1 / 3;
  min-width: 175px;
  max-width: 200px;
  margin: 0 auto;
}
</style>
