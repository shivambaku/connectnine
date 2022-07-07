<script setup lang="ts">
import { storeToRefs } from 'pinia';

const leaderboardStore = useLeaderboardStore();
const { leaderboard } = storeToRefs(leaderboardStore);
const { getTopTen } = leaderboardStore;

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
          <div>
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
        <div class="leaderboard-info">
          <div>
            {{ leaderboardInfo.name === null ? 'Anonymous' : leaderboard.name }}
          </div>
          <div>
            {{ leaderboardInfo.score }}
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
  max-width: 300px;
  min-width: 300px;
  padding: 20px 0px;
  height: auto;
  margin: 0 auto;
  background: var(--game-background-color);
  color: var(--game-foreground-color);
  font-weight: 400;
  font-size: 14px;
  border-radius: 10px;
}

.leaderboard-row {
  margin: 5px 20px;
  display: grid;
  gap: 10px;
  grid-template-columns: 42px auto;
}

.leaderboard-header {
  grid-column: 2;
  padding: 0px 20px;
  font-weight: 800;
  display: grid;
  grid-template-columns: 60% auto;
}

.leaderboard-rank {
  border-radius: 6px;
  background: rgba(31, 120, 180, 0.2);
  padding: 10px;
  width: 22px;
}

.leaderboard-info {
  padding: 10px 20px;
  border-radius: 6px;
  background: rgba(31, 120, 180, 0.2);
  display: grid;
  grid-template-columns: 60% auto;
}
</style>
