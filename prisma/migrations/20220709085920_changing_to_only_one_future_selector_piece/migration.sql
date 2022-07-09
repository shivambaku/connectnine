/*
  Warnings:

  - You are about to drop the column `futureSelectorPieces` on the `GameState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "futureSelectorPieces",
ADD COLUMN     "nextSelectorPiece" INTEGER NOT NULL DEFAULT 1;
