-- AlterTable
ALTER TABLE "GameState" ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "GameState_score_idx" ON "GameState"("score" DESC);
