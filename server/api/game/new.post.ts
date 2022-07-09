import { newGame } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId } = await useBody(event);
  return await newGame(playerId);
});
