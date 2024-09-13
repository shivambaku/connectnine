import { PrismaClient } from '@prisma/client';
import { Filter } from 'bad-words';
import Settings from '../utils/settings';
import type { ClientGameState, ClientPlayer } from '~~/interfaces';

const prisma = new PrismaClient();

export async function load(playerId: string) {
  // create a player id if it does not exist
  if (playerId === null) {
    const player = await prisma.player.create({
      data: {
        achievement: {
          create: {
          },
        },
      },
      select: {
        id: true,
        currentName: true,
      },
    });

    const clientGameState = await newGame(player.id);
    const clientPlayer: ClientPlayer = {
      id: player.id,
      currentName: player.currentName,
      currentGameState: clientGameState,
    };
    return clientPlayer;
  }
  // otherwise load the game
  else {
    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
      select: {
        id: true,
        currentName: true,
        currentGameStateId: true,
      },
    });

    if (player === null)
      throw new Error(`player id: ${playerId} is invalid`);

    const clientGameState = await prisma.gameState.findUnique({
      where: {
        id: player.currentGameStateId,
      },
      select: {
        boardPieces: true,
        selectorPieces: true,
        nextSelectorPiece: true,
        score: true,
        previousState: true,
      },
    });

    const clientPlayer: ClientPlayer = {
      id: player.id,
      currentName: player.currentName,
      currentGameState: clientGameState,
    };
    return clientPlayer;
  }
}

export async function newGame(playerId: string) {
  if (playerId === null)
    throw new Error(`player id: ${playerId} is invalid`);

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      id: true,
      currentName: true,
    },
  });

  const gameState = await prisma.gameState.create({
    data: {
      boardPieces: Array(Settings.boardSize * Settings.boardSize).fill(0),
      selectorPieces: [...Array(Settings.selectorCount)].map(_ => getRandomPiece()),
      nextSelectorPiece: getRandomPiece(),
      nextNextSelectorPiece: getRandomPiece(),
      name: player.currentName,
      playerId: player.id,
    },
    select: {
      id: true,
      boardPieces: true,
      selectorPieces: true,
      nextSelectorPiece: true,
      score: true,
      previousState: true,
    },
  });

  await prisma.player.update({
    data: {
      currentGameStateId: gameState.id,
    },
    where: {
      id: playerId,
    },
    select: {
      id: true,
    },
  });

  const clientGameState: ClientGameState = {
    boardPieces: gameState.boardPieces,
    selectorPieces: gameState.selectorPieces,
    nextSelectorPiece: gameState.nextSelectorPiece,
    score: gameState.score,
    previousState: gameState.previousState,
  };
  return clientGameState;
}

export async function place(playerId: string, x: number, y: number, selectedIndex: number) {
  if (outOfBounds(x, y))
    throw new Error(`x: ${x}, y: ${y} is invalid`);

  if (selectedIndex < 0 || selectedIndex >= Settings.selectorCount)
    throw new Error(`selectedIndex: ${selectedIndex} is invalid`);

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      currentGameStateId: true,
    },
  });

  if (player === null)
    throw new Error(`player id: ${playerId} is invalid`);

  const gameState = await prisma.gameState.findUnique({
    where: {
      id: player.currentGameStateId,
    },
    select: {
      boardPieces: true,
      selectorPieces: true,
      nextSelectorPiece: true,
      nextNextSelectorPiece: true,
      score: true,
      previousState: true,
    },
  });

  // save the current state in the previous state before making changes
  // set previous state to null to not have previous state reference previous previous state
  let clientGameState: ClientGameState = {
    boardPieces: gameState.boardPieces,
    selectorPieces: gameState.selectorPieces,
    nextSelectorPiece: gameState.nextSelectorPiece,
    score: gameState.score,
    previousState: null,
  };

  gameState.previousState = JSON.stringify(clientGameState);

  // the value that we will be placing
  const value = gameState.selectorPieces[selectedIndex];

  // place the piece and connect the pieces if needed
  placeHelper(gameState, x, y, value);

  // get new random value for the selector from the predefined next selector
  const largestOnBoard = Math.max(...gameState.boardPieces);
  gameState.selectorPieces[selectedIndex] = gameState.nextSelectorPiece;
  gameState.nextSelectorPiece = gameState.nextNextSelectorPiece;
  gameState.nextNextSelectorPiece = getRandomPiece(largestOnBoard);

  // update the gameState in the database
  clientGameState = await prisma.gameState.update({
    data: gameState,
    where: {
      id: player.currentGameStateId,
    },
    select: {
      boardPieces: true,
      selectorPieces: true,
      nextSelectorPiece: true,
      score: true,
      previousState: true,
    },
  });

  return clientGameState;
}

export async function undo(playerId: string) {
  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      currentGameStateId: true,
    },
  });

  if (player === null)
    throw new Error(`player id: ${playerId} is invalid`);

  let gameState = await prisma.gameState.findUnique({
    where: {
      id: player.currentGameStateId,
    },
    select: {
      name: true,
      boardPieces: true,
      selectorPieces: true,
      nextSelectorPiece: true,
      score: true,
      previousState: true,
      nextNextSelectorPiece: true,
    },
  });

  if (gameState.previousState != null) {
    // do not undo the name
    const name = gameState.name;

    // undo the state
    const nextSelectorPiece = gameState.nextSelectorPiece;
    gameState = JSON.parse(gameState.previousState);
    gameState.nextNextSelectorPiece = nextSelectorPiece;
    gameState.name = name;

    // update the gameState in the database
    const clientGameState = await prisma.gameState.update({
      data: gameState,
      where: {
        id: player.currentGameStateId,
      },
      select: {
        boardPieces: true,
        selectorPieces: true,
        nextSelectorPiece: true,
        score: true,
        previousState: true,
      },
    });

    return clientGameState;
  }
  else {
    const clientGameState: ClientGameState = {
      boardPieces: gameState.boardPieces,
      selectorPieces: gameState.selectorPieces,
      nextSelectorPiece: gameState.nextSelectorPiece,
      score: gameState.score,
      previousState: gameState.previousState,
    };
    return clientGameState;
  }
}

export async function changeName(playerId: string, name: string) {
  if (!isValidName(name))
    throw new Error(`change name for player id: ${playerId} failed due to bad name ${name}`);

  const player = await prisma.player.findUnique({
    where: {
      id: playerId,
    },
    select: {
      currentGameStateId: true,
    },
  });

  if (player === null)
    throw new Error(`player id: ${playerId} is invalid`);

  // update the player in the database
  await prisma.player.update({
    data: {
      currentName: name,
    },
    where: {
      id: playerId,
    },
    select: {
      id: true,
    },
  });

  // update the gameState in the database
  await prisma.gameState.update({
    data: {
      name,
    },
    where: {
      id: player.currentGameStateId,
    },
    select: {
      id: true,
    },
  });
}

function placeHelper(gameState: ClientGameState, x: number, y: number, value: number) {
  const index = xytoi(x, y);

  // place the piece
  gameState.boardPieces[index] = value;

  // check if connections were formed
  const visited = new Set<number>();
  checkConnections(gameState, x, y, value, visited);

  // a connection was formed
  if (visited.size >= 3) {
    gameState.score += visited.size * value * 10;

    // besides the placed piece set all visited pieces to empty
    visited.delete(index);
    for (const visitedIndex of visited)
      gameState.boardPieces[visitedIndex] = 0;

    placeHelper(gameState, x, y, value + 1);
  }
}

function checkConnections(gameState: ClientGameState, x: number, y: number, value: number, visited: Set<number>) {
  const index = xytoi(x, y);
  if (!outOfBounds(x, y) && sameValue(gameState, index, value) && !visited.has(index)) {
    visited.add(index);

    checkConnections(gameState, x, y + 1, value, visited);
    checkConnections(gameState, x + 1, y, value, visited);
    checkConnections(gameState, x, y - 1, value, visited);
    checkConnections(gameState, x - 1, y, value, visited);
  }
}

function sameValue(gameState: ClientGameState, index: number, value: number) {
  return gameState.boardPieces[index] === value;
}

function outOfBounds(x: number, y: number) {
  return x < 0 || x >= Settings.boardSize || y < 0 || y >= Settings.boardSize;
}

function xytoi(x: number, y: number) {
  return y * Settings.boardSize + x;
}

function getRandomPiece(largestOnBoard = 0) {
  let specIndex = 0;
  if (largestOnBoard === 3)
    specIndex = 1;
  else if (largestOnBoard === 4)
    specIndex = 2;
  else if (largestOnBoard >= 5)
    specIndex = 3;

  const spec = Settings.randomness[specIndex];

  const rand = Math.random();
  let sum = 0;
  for (let i = 0; i < spec.length; i += 1) {
    sum += spec[i];
    if (rand <= sum)
      return i + 1;
  }
  return 0;
}

function isValidName(name: string) {
  if (name === null)
    return true;

  const filter = new Filter();
  if (filter.isProfane(name) || name.length > 16)
    return false;

  return true;
}

