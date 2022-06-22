import { PrismaClient } from '@prisma/client';
import Settings from '../utils/settings';

export function getRandomPiece() {
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < Settings.randomness.length; i += 1) {
    sum += Settings.randomness[i];
    if (rand <= sum)
      return i + 1;
  }
  return 0;
}

export function outOfBounds(x: number, y: number) {
  return x < 0 || x >= Settings.boardSize || y < 0 || y >= Settings.boardSize;
}

export function newGame() {

}

