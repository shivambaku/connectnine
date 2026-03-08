export interface ConnectionAnimationDataPart {
  x: number
  y: number
  parentX: number
  parentY: number
  level: number
  value: number
}

export interface ScoreAnimationInfo {
  type: 'new_highest' | 'count_increase'
  value: number
  // Board grid coordinates of the source tile (where the merge result sits)
  sourceX: number
  sourceY: number
}

export interface ClientGameState {
  boardPieces: number[]
  selectorPieces: number[]
  nextSelectorPiece: number
  score: number
  previousState: string | null
  moves: number
  highestNumber: number
  highestNumberCount: number
  highestNumberMoves: number
}

export interface ClientPlayer {
  id: string
  currentGameState: ClientGameState
  currentName: string
}
