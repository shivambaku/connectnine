import { load } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  // // add a timer for testing
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const { playerId } = await readBody(event);
  return await load(playerId);
});
