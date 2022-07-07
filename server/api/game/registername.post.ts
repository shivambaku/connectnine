import { changeName } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { gameId, name } = await useBody(event);
  await changeName(gameId, name);
  return '';
});
