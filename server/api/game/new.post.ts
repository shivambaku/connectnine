import { newGame } from '~~/server/services/gameService';

export default defineEventHandler(async (_) => {
  return await newGame();
});
