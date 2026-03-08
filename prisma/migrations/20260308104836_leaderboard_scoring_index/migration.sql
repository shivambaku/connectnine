-- CreateIndex
CREATE INDEX "GameState_highestNumber_highestNumberCount_highestNumberMov_idx" ON "GameState"("highestNumber" DESC, "highestNumberCount" DESC, "highestNumberMoves" ASC);
