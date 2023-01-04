import { newGame } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId } = await readBody(event);
  return await newGame(playerId);
});
