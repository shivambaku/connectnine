import { place } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { gameId, x, y, selectedIndex } = await useBody(event);
  return await place(gameId, x, y, selectedIndex);
});
