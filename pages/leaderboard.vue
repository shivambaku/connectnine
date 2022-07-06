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
      coming soon...
      {{ leaderboard }}
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
  height: 300px;
  margin: 0 auto;
  background: var(--game-background-color);
  border-radius: 10px;
}
</style>
