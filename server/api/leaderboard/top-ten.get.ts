import { getTop } from '~~/server/services/leaderboardService';

export default defineEventHandler(async () => {
  // add a timer for testing
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await getTop(10);
});
