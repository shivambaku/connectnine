import { newGame } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { name } = await useBody(event);
  return await newGame(name);
});
