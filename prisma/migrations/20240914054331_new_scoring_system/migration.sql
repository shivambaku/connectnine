/*
  Warnings:

  - Made the column `name` on table `GameState` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currentName` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "highestNumber" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highestNumberCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "highestNumberMoves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "moves" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "currentName" SET NOT NULL;
