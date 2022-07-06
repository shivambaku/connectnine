import { defineStore } from 'pinia';

export const useLeaderboardStore = defineStore('gameStore', () => {
  const leaderboard = ref<{
    score: number
    name: string
    boardPieces: number[]
  }>(null);

  const getTopTen = async () => {
    leaderboard.value = await $fetch('/api/leaderboard/topten');
  };

  return { leaderboard, getTopTen };
});

