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
      <div
        v-for="(leaderboardInfo, i) in leaderboard"
        :key="`leaderboardInfo${i}`"
        class="leaderboard-info"
      >
        <div>
          {{ i + 1 }}
        </div>
        <div class="name">
          {{ leaderboardInfo.name === null ? 'Anonymous' : leaderboard.nam }}
        </div>
        <div class="score">
          {{ leaderboardInfo.score }}
        </div>
      </div>
      <div>
        coming soon...
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
  padding-top: 20px;
  padding-bottom: 20px;
  height: auto;
  margin: 0 auto;
  background: var(--game-background-color);
  border-radius: 10px;
}

.leaderboard-info {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 20px;
  margin-right: 20px;
  padding: 10px;
  gap: 2.5rem;
  border-radius: 6px;
  background: rgba(31, 120, 180, 0.2);
  display: grid;
  grid-template-columns: 60px 30px 150px;
  font-weight: 400;
  font-size: 17px;
}

.leaderboard-info .name {
  color: var(--game-foreground-color);
  text-align: center;
}

.leaderboard-info .score {
  color: var(--game-foreground-color);
  text-align: right;
}
</style>
