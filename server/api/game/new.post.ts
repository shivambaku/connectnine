import { newGame } from '~~/server/services/gameService';

export default defineEventHandler(async () => {
  return await newGame();
});
