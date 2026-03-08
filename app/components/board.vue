<script setup lang="ts">
import type { ConnectionAnimationDataPart, ScoreAnimationInfo } from '~~/shared/types/interfaces'
import { createTimeline } from 'animejs'

const props = defineProps<{
  loading: boolean
  width: number
  padding: number
  piecePadding: number
  pieceRadius: number
  pieces: Array<number> | undefined
  boardSize: number
  unclickable?: boolean
}>()

const emit = defineEmits<{
  place: [x: number, y: number]
  animatedPlace: [
    x: number,
    y: number,
    animateConnection: (data: ConnectionAnimationDataPart[], callback: () => void) => void,
    onMilestone: (scoreInfo: ScoreAnimationInfo, doneCallback: () => void) => void,
  ]
}>()

const connectionAnimationData = ref(new Array<ConnectionAnimationDataPart>())

// Template refs for connection animation rect elements (populated by v-for ref)
const connectionRefs = ref<SVGRectElement[]>([])

// Flying tile state — rendered as a fixed-position HTML overlay
const flyingTile = ref<{
  value: number
  x: number
  y: number
  width: number
  height: number
} | null>(null)

// Template ref for the flying tile element
const flyingTileRef = ref<HTMLDivElement | null>(null)

// Reference to the board SVG element for coordinate calculations
const boardSvgRef = ref<SVGSVGElement | null>(null)

const innerWidth = computed(() => {
  return props.width - 2 * props.padding
})

const pieceWidth = computed(() => {
  return innerWidth.value / props.boardSize
})

const animatedPieceWidth = computed(() => {
  return pieceWidth.value - 2 * props.piecePadding
})

const twoAnimatedPiecesWidth = computed(() => {
  return 2 * (animatedPieceWidth.value + props.piecePadding)
})

const itox = (i: number) => i % props.boardSize

const itoy = (i: number) => Math.floor(i / props.boardSize)

function scale(x: number) {
  const t = x / props.boardSize
  return innerWidth.value * t
}

function animatedPieceScale(x: number) {
  return scale(x) + props.piecePadding
}

/**
 * Convert board grid coordinates to screen (page) pixel coordinates.
 * Returns the center point of the tile in page coordinates.
 */
function boardCoordsToScreen(gridX: number, gridY: number): { x: number, y: number, size: number } {
  if (!boardSvgRef.value) return { x: 0, y: 0, size: 0 }

  const svgRect = boardSvgRef.value.getBoundingClientRect()
  const svgViewBoxWidth = props.width
  const scaleRatio = svgRect.width / svgViewBoxWidth

  // SVG coordinates of the tile center (accounting for the padding translate on the <g>)
  const svgX = props.padding + animatedPieceScale(gridX) + animatedPieceWidth.value / 2
  const svgY = props.padding + animatedPieceScale(gridY) + animatedPieceWidth.value / 2

  return {
    x: svgRect.left + svgX * scaleRatio,
    y: svgRect.top + svgY * scaleRatio,
    size: animatedPieceWidth.value * scaleRatio,
  }
}

/**
 * Animate a tile flying from a board position to the score container.
 * The tile is rendered as a fixed-position HTML overlay to cross SVG boundaries.
 */
async function animateFlyToScore(
  sourceGridX: number,
  sourceGridY: number,
  value: number,
  scoreTargetEl: HTMLElement | null,
  callback: () => void,
) {
  if (!scoreTargetEl || !boardSvgRef.value) {
    callback()
    return
  }

  const source = boardCoordsToScreen(sourceGridX, sourceGridY)
  const targetRect = scoreTargetEl.getBoundingClientRect()
  const targetCenterX = targetRect.left + targetRect.width / 2
  const targetCenterY = targetRect.top + targetRect.height / 2

  const tileSize = source.size
  const startX = source.x - tileSize / 2
  const startY = source.y - tileSize / 2

  // Target size — match the score tile roughly
  const targetSize = Math.min(targetRect.width, targetRect.height) * 0.8

  // Compute the delta for translate (anime.js maps x/y to translateX/translateY for DOM elements)
  const targetLeft = targetCenterX - targetSize / 2
  const targetTop = targetCenterY - targetSize / 2
  const deltaX = targetLeft - startX
  const deltaY = targetTop - startY

  flyingTile.value = {
    value,
    x: startX,
    y: startY,
    width: tileSize,
    height: tileSize,
  }

  await nextTick()

  const el = flyingTileRef.value
  if (!el) {
    callback()
    return
  }

  createTimeline({
    defaults: { ease: 'inOutCubic' },
    onComplete: async () => {
      flyingTile.value = null
      await nextTick()
      callback()
    },
  })
    .add(el, {
      duration: 400,
      translateX: `${deltaX}px`,
      translateY: `${deltaY}px`,
      width: `${targetSize}px`,
      height: `${targetSize}px`,
      fontSize: `${targetSize * 0.35}px`,
    })
    .add(el, {
      duration: 150,
      opacity: 0,
      ease: 'linear',
    })
}

async function animateConnection(
  connectionAnimationDataArg: Array<ConnectionAnimationDataPart>,
  callback: () => void,
) {
  connectionAnimationData.value = connectionAnimationDataArg
  connectionRefs.value = []

  await nextTick()

  // Partition refs by level using the data array
  const level1Els: SVGRectElement[] = []
  const level2Els: SVGRectElement[] = []
  for (let i = 0; i < connectionAnimationDataArg.length; i++) {
    const el = connectionRefs.value[i]
    if (!el) continue
    if (connectionAnimationDataArg[i].level === 1) level1Els.push(el)
    else level2Els.push(el)
  }

  const timeline = createTimeline({
    defaults: {
      ease: 'linear',
      duration: 150,
    },
    onComplete: async () => {
      connectionAnimationData.value = []
      await nextTick()
      callback()
    },
  })

  if (level2Els.length > 0) {
    timeline
      .add(level2Els, {
        keyframes: [
          {
            width: `${animatedPieceWidth.value}px`,
            height: `${animatedPieceWidth.value}px`,
            x: (el: SVGRectElement) => `${animatedPieceScale(connectionAnimationData.value[Number(el.id)].parentX)}px`,
            y: (el: SVGRectElement) => `${animatedPieceScale(connectionAnimationData.value[Number(el.id)].parentY)}px`,
          },
          { opacity: 0.0, duration: 0 },
        ],
      })
  }

  if (level1Els.length > 0) {
    timeline
      .add(level1Els, {
        keyframes: [
          {
            width: `${animatedPieceWidth.value}px`,
            height: `${animatedPieceWidth.value}px`,
            x: (el: SVGRectElement) => `${animatedPieceScale(connectionAnimationData.value[Number(el.id)].parentX)}px`,
            y: (el: SVGRectElement) => `${animatedPieceScale(connectionAnimationData.value[Number(el.id)].parentY)}px`,
          },
          { opacity: 0.0, duration: 100 },
        ],
      })
  }
}

// Store references to score animation callback and target element.
// These are set by the parent component via setScoreAnimationContext.
let currentOnScoreAnimation: ((info: ScoreAnimationInfo) => void) | null = null
let currentOnFlyStart: (() => void) | null = null
let currentScoreTargetEl: HTMLElement | null = null

function setScoreAnimationContext(
  onScoreAnimation: ((info: ScoreAnimationInfo) => void) | null,
  onFlyStart: (() => void) | null,
  scoreTargetEl: HTMLElement | null,
) {
  currentOnScoreAnimation = onScoreAnimation
  currentOnFlyStart = onFlyStart
  currentScoreTargetEl = scoreTargetEl
}

/**
 * Called by the store when a milestone is reached (new highest number or count increase).
 * Flies the milestone tile from the board to the score container, then calls doneCallback.
 */
function handleMilestone(scoreInfo: ScoreAnimationInfo, doneCallback: () => void) {
  // Notify parent to suppress watchers during the fly
  if (currentOnFlyStart) {
    currentOnFlyStart()
  }

  animateFlyToScore(
    scoreInfo.sourceX,
    scoreInfo.sourceY,
    scoreInfo.value,
    currentScoreTargetEl,
    () => {
      // Unblock the board first so the player can place the next piece
      doneCallback()
      // Then trigger the cosmetic score animation (pulse/counter roll)
      if (currentOnScoreAnimation) {
        currentOnScoreAnimation(scoreInfo)
      }
    },
  )
}

defineExpose({ setScoreAnimationContext })

function place(i: number, value: number) {
  // only place if the spot is empty
  if (value === 0 && !props.unclickable)
    emit('animatedPlace', itox(i), itoy(i), animateConnection, handleMilestone)
}
</script>

<template>
  <svg
    v-if="loading"
    class="board skeleton" :viewBox="`0 0 ${props.width} ${props.width}`"
  >
    <g :transform="`translate(${props.padding}, ${props.padding})`">
      <Piece
        v-for="(piece, i) in Array.from({ length: boardSize * boardSize }, () => 0)" :key="i"
        :value="piece"
        :x="scale(itox(i))" :y="scale(itoy(i))"
        :width="pieceWidth"
        :padding="piecePadding"
        :radius="pieceRadius"
      />
    </g>
  </svg>
  <svg
    v-else
    ref="boardSvgRef"
    class="board" :viewBox="`0 0 ${props.width} ${props.width}`"
  >
    <g :transform="`translate(${props.padding}, ${props.padding})`">
      <Piece
        v-for="(piece, i) in pieces" :key="i"
        :value="piece"
        :x="scale(itox(i))" :y="scale(itoy(i))"
        :width="pieceWidth"
        :padding="piecePadding"
        :radius="pieceRadius"
        @click="place(i, piece)"
      />
      <g>
        <rect
          v-for="(d, i) in connectionAnimationData"
          :id="i.toString()"
          :ref="(el: any) => { if (el) connectionRefs[i] = el as SVGRectElement }"
          :key="`connectionAnimationDataPart${i}`"
          :class="`piece piece-${d.value}`"
          :rx="pieceRadius"
          :ry="pieceRadius"
          :x="d.x < d.parentX ? animatedPieceScale(d.x) : animatedPieceScale(d.parentX)"
          :y="d.y < d.parentY ? animatedPieceScale(d.y) : animatedPieceScale(d.parentY)"
          :width="d.x === d.parentX ? animatedPieceWidth : twoAnimatedPiecesWidth"
          :height="d.y === d.parentY ? animatedPieceWidth : twoAnimatedPiecesWidth"
        />
      </g>
    </g>
  </svg>
  <!-- Flying tile overlay — positioned fixed to fly across SVG boundaries -->
  <div
    v-if="flyingTile"
    ref="flyingTileRef"
    class="flying-tile"
    :class="`piece-bg-${flyingTile.value}`"
    :style="{
      left: `${flyingTile.x}px`,
      top: `${flyingTile.y}px`,
      width: `${flyingTile.width}px`,
      height: `${flyingTile.height}px`,
      fontSize: `${flyingTile.width * 0.35}px`,
    }"
  >
    {{ flyingTile.value }}
  </div>
</template>

<style scoped>
.board {
  border-radius: 10px;
  background: var(--game-background-color);
  margin: 10px 0px;
}

.animated-piece {
  pointer-events: none;
}

.flying-tile {
  position: fixed;
  border-radius: 6px;
  z-index: 1000;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: var(--game-foreground-color);
}
</style>

<style>
/* Flying tile background colors — uses same CSS custom properties as SVG piece fills */
.piece-bg-1 { background-color: var(--piece-color-1); }
.piece-bg-2 { background-color: var(--piece-color-2); }
.piece-bg-3 { background-color: var(--piece-color-3); }
.piece-bg-4 { background-color: var(--piece-color-4); }
.piece-bg-5 { background-color: var(--piece-color-5); }
.piece-bg-6 { background-color: var(--piece-color-6); }
.piece-bg-7 { background-color: var(--piece-color-7); }
.piece-bg-8 { background-color: var(--piece-color-8); }
.piece-bg-9 { background-color: var(--piece-color-9); }
</style>
