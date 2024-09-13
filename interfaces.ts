export interface ConnectionAnimationDataPart {
  x: number
  y: number
  parentX: number
  parentY: number
  level: number
  value: number
}

export interface ClientGameState {
  boardPieces: number[]
  selectorPieces: number[]
  nextSelectorPiece: number
  score: number
  previousState: string
}

export interface ClientPlayer {
  id: string
  currentGameState: ClientGameState
  currentName: string | null
}
