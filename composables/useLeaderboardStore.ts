import { defineStore } from 'pinia';
interface LeaderboardInfo {
  score: number
  name: string
  boardPieces: number[]
}

export const useLeaderboardStore = defineStore('leaderboardStore', () => {
  const leaderboard = ref<LeaderboardInfo[]>(null);

  const getTopTen = async () => {
    leaderboard.value = await $fetch('/api/leaderboard/top-ten');
  };

  return { leaderboard, getTopTen };
});

