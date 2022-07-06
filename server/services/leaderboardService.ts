import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTop(n = 10) {
  const topTen = await prisma.gameState.findMany({
    take: n,
    orderBy: {
      score: 'desc',
    },
    select: {
      score: true,
      name: true,
      boardPieces: true,
    },
  });

  return topTen;
}

