import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
interface LeaderbaordInfo {
  score: number
  name: string
  boardPieces: number[]
}

export const useLeaderboardStore = defineStore('leaderboardStore', () => {
  const leaderboard = ref<LeaderbaordInfo[]>(null);

  const getTopTen = async () => {
    leaderboard.value = await $fetch('/api/leaderboard/topten');
  };

  return { leaderboard, getTopTen };
});

