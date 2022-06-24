-- CreateTable
CREATE TABLE "GameState" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardPieces" INTEGER[],
    "selectorPieces" INTEGER[],
    "futureSelectorPieces" INTEGER[],
    "selectedIndex" INTEGER NOT NULL DEFAULT 0,
    "score" INTEGER NOT NULL DEFAULT 0,
    "canUndo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("id")
);
