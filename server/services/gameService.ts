import type { GameState } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import Settings from '../utils/settings';

const prisma = new PrismaClient();

export async function newGame() {
  const gameState = await prisma.gameState.create({
    data: {
      boardPieces: Array(Settings.boardSize * Settings.boardSize).fill(0),
      selectorPieces: [...Array(Settings.selectorCount)].map(_ => getRandomPiece()),
      futureSelectorPieces: [...Array(Settings.selectorCount)].map(_ => getRandomPiece()),
    },
  });

  const values = [];
  for (let i = 0; i < 100000; ++i)
    values.push(getRandomPiece());

  console.log(values.filter(x => x === 0).length);
  console.log(values.filter(x => x === 1).length);
  console.log(values.filter(x => x === 2).length);
  console.log(values.filter(x => x === 3).length);
  console.log(values.filter(x => x === 4).length);
  console.log(values.filter(x => x === 5).length);

  return gameState;
}

export async function loadGame(gameId: string) {
  if (gameId === null)
    return await newGame();

  const gameState = await prisma.gameState.findUnique({
    where: {
      id: gameId,
    },
  });

  if (gameState === null)
    return await newGame();

  return gameState;
}

export async function place(gameId: string, x: number, y: number, selectedIndex: number) {
  if (outOfBounds(x, y))
    throw new Error(`x: ${x}, y: ${y} is invalid`);

  if (selectedIndex < 0 || selectedIndex >= Settings.selectorCount)
    throw new Error(`selectedIndex: ${selectedIndex} is invalid`);

  let gameState = await prisma.gameState.findUnique({
    where: {
      id: gameId,
    },
  });

  if (gameState === null)
    throw new Error(`game id: ${gameId} is invalid`);

  // save the previous state so that we can undo later
  gameState.previousState = null;
  gameState.previousState = JSON.stringify(gameState);

  // the value that we will be placing
  const value = gameState.selectorPieces[selectedIndex];

  // place the piece and connect the pieces if needed
  placeHelper(gameState, x, y, value);

  // get new random value for the selector from the predifned future selectors
  gameState.selectorPieces[selectedIndex] = gameState.futureSelectorPieces[selectedIndex];
  gameState.futureSelectorPieces[selectedIndex] = getRandomPiece();

  // update the gamestate in the database
  gameState = await prisma.gameState.update({
    data: gameState,
    where: {
      id: gameId,
    },
  });

  return gameState;
}

export async function undo(gameId: string) {
  let gameState = await prisma.gameState.findUnique({
    where: {
      id: gameId,
    },
  });

  if (gameState === null)
    throw new Error(`game id: ${gameId} is invalid`);

  if (gameState.previousState != null) {
    // undo the state
    gameState = JSON.parse(gameState.previousState);

    // update the gamestate in the database
    gameState = await prisma.gameState.update({
      data: gameState,
      where: {
        id: gameId,
      },
    });
  }

  return gameState;
}

function placeHelper(gameState: GameState, x: number, y: number, value: number) {
  const index = xytoi(x, y);

  // place the piece
  gameState.boardPieces[index] = value;

  // check if connections were formed
  const visited = new Set<number>();
  checkConnections(gameState, x, y, value, visited);

  // a connection was formed
  if (visited.size >= 3) {
    gameState.score += visited.size * value;

    // besides the placed piece set all visited pieces to empty
    visited.delete(index);
    for (const visitedIndex of visited)
      gameState.boardPieces[visitedIndex] = 0;

    placeHelper(gameState, x, y, value + 1);
  }
}

function checkConnections(gameState: GameState, x: number, y: number, value: number, visited: Set<number>) {
  const index = xytoi(x, y);
  if (!outOfBounds(x, y) && sameValue(gameState, index, value) && !visited.has(index)) {
    visited.add(index);

    checkConnections(gameState, x, y + 1, value, visited);
    checkConnections(gameState, x + 1, y, value, visited);
    checkConnections(gameState, x, y - 1, value, visited);
    checkConnections(gameState, x - 1, y, value, visited);
  }
}

function sameValue(gameState: GameState, index: number, value: number) {
  return gameState.boardPieces[index] === value;
}

function outOfBounds(x: number, y: number) {
  return x < 0 || x >= Settings.boardSize || y < 0 || y >= Settings.boardSize;
}

function xytoi(x: number, y: number) {
  return y * Settings.boardSize + x;
}

function getRandomPiece() {
  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < Settings.randomness.length; i += 1) {
    sum += Settings.randomness[i];
    if (rand <= sum)
      return i + 1;
  }
  return 0;
}
