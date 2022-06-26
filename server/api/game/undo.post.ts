import { undo } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { gameId } = await useBody(event);
  return await undo(gameId);
});
