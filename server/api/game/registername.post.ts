import { changeName } from '~~/server/services/gameService';

export default defineEventHandler(async (event) => {
  const { playerId, name } = await useBody(event);
  await changeName(playerId, name);
  return '';
});
