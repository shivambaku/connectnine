import { prisma } from '../utils/prisma';

export async function getTop(n = 10) {
  const topTen = await prisma.gameState.findMany({
    take: n,
    orderBy: [
      { highestNumber: 'desc' },
      { highestNumberCount: 'desc' },
      { highestNumberMoves: 'asc' },
    ],
    where: {
      highestNumber: { gt: 0 },
    },
    select: {
      highestNumber: true,
      highestNumberCount: true,
      highestNumberMoves: true,
      name: true,
      boardPieces: true,
    },
  });

  return topTen;
}

