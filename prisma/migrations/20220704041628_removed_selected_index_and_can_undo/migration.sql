/*
  Warnings:

  - You are about to drop the column `canUndo` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `selectedIndex` on the `GameState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "canUndo",
DROP COLUMN "selectedIndex";
