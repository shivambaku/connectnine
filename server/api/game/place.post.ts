import { place } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId, x, y, selectedIndex } = await useBody(event);
  return await place(playerId, x, y, selectedIndex);
});
