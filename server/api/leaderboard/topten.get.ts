import { getTop } from '~~/server/services/leaderboardService';

export default defineEventHandler(async () => {
  return await getTop(10);
});
