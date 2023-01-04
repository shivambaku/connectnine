import { place } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId, x, y, selectedIndex } = await readBody(event);
  return await place(playerId, x, y, selectedIndex);
});
