import type { GameState } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import Settings from '../utils/settings';
import type { ConnectionAnimationDataPart } from '~~/interfaces';

const prisma = new PrismaClient();

export async function newGame() {
  const gameState = await prisma.gameState.create({
    data: {
      boardPieces: Array(Settings.boardSize * Settings.boardSize).fill(0),
      selectorPieces: [...Array(Settings.selectorCount)].map(_ => getRandomPiece()),
      futureSelectorPieces: [...Array(Settings.selectorCount)].map(_ => getRandomPiece()),
    },
  });

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

  // mark the selected to the currently selected
  gameState.selectedIndex = selectedIndex;

  // save the previous state so that we can undo later
  gameState.previousState = null;
  gameState.previousState = JSON.stringify(gameState);

  // the value that we will be placing
  const value = gameState.selectorPieces[selectedIndex];

  // stores all the connections formed in one placement
  const connectionsAnimationData = new Array<Array<ConnectionAnimationDataPart>>();

  // place the piece and connect the pieces if needed
  placeHelper(gameState, x, y, value, connectionsAnimationData);

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

  return { gameState, connectionsAnimationData };
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

function placeHelper(gameState: GameState, x: number, y: number, value: number, connectionsAnimationData: Array<Array<ConnectionAnimationDataPart>>) {
  const index = xytoi(x, y);

  // place the piece
  gameState.boardPieces[index] = value;

  // stores the animation data for one connection
  const connectionAnimationData = new Array<ConnectionAnimationDataPart>();

  // check if connections were formed
  const visited = new Set<number>();
  checkConnections(gameState, x, y, value, visited, connectionAnimationData, x, y, 0);

  // a connection was formed
  if (visited.size >= 3) {
    gameState.score += visited.size * value;

    // besides the placed piece set all visited pieces to empty
    visited.delete(index);
    for (const visitedIndex of visited)
      gameState.boardPieces[visitedIndex] = 0;

    // animation data of all connections
    connectionsAnimationData.push(connectionAnimationData);

    placeHelper(gameState, x, y, value + 1, connectionsAnimationData);
  }
}

function checkConnections(gameState: GameState, x: number, y: number, value: number, visited: Set<number>, connectionAnimationDataPart: Array<ConnectionAnimationDataPart>, parentX: number, parentY: number, level: number) {
  const index = xytoi(x, y);
  if (!outOfBounds(x, y) && sameValue(gameState, index, value) && !visited.has(index)) {
    visited.add(index);

    if (level !== 0) {
      connectionAnimationDataPart.push({
        x,
        y,
        parentX,
        parentY,
        level,
      });
    }

    checkConnections(gameState, x, y + 1, value, visited, connectionAnimationDataPart, x, y, level + 1);
    checkConnections(gameState, x + 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1);
    checkConnections(gameState, x, y - 1, value, visited, connectionAnimationDataPart, x, y, level + 1);
    checkConnections(gameState, x - 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1);
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
