import { load } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId } = await useBody(event);
  return await load(playerId);
});
