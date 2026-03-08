<script setup lang="ts">
import type { ConnectionAnimationDataPart, BoardClearAnimationDataPart } from '~~/shared/types/interfaces'
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
  animatedPlace: [x: number, y: number, animateConnection: any, animateBoardClear: any]
}>()

const connectionAnimationData = ref(new Array<ConnectionAnimationDataPart>())
const boardClearAnimationData = ref(new Array<BoardClearAnimationDataPart>())
const nineHighlightData = ref<{ x: number, y: number, size: number } | null>(null)
const particleBurstData = ref<Array<{
  x: number
  y: number
  targetX: number
  targetY: number
  size: number
}>>([])

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

async function animateConnection(connectionAnimationDataArg: Array<ConnectionAnimationDataPart>, callback: any) {
  connectionAnimationData.value = connectionAnimationDataArg

  await nextTick()

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

  // Level 2 animation: first half of the connection
  // Level 1 animation: second half (connecting to the placed piece)
  // Both animations consist of scaling the rectangles (or translate + scale)
  // and removing the opacity after done
  timeline
    .add('.level2ConnectionAnimationDataPart', {
      keyframes: [
        {
          width: `${animatedPieceWidth.value}px`,
          height: `${animatedPieceWidth.value}px`,
          x: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentX)}px`,
          y: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentY)}px`,
        },
        { opacity: 0.0, duration: 0 },
      ],
    })
    .add('.level1ConnectionAnimationDataPart', {
      keyframes: [
        {
          width: `${animatedPieceWidth.value}px`,
          height: `${animatedPieceWidth.value}px`,
          x: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentX)}px`,
          y: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentY)}px`,
        },
        { opacity: 0.0, duration: 100 },
      ],
    })
}

async function animateBoardClear(targetX: number, targetY: number, piecesSnapshot: number[], callback: any) {
  // collect all non-zero pieces from the board snapshot, excluding the 9 at the target position
  const data: BoardClearAnimationDataPart[] = []
  for (let i = 0; i < piecesSnapshot.length; i++) {
    if (piecesSnapshot[i] !== 0 && !(itox(i) === targetX && itoy(i) === targetY)) {
      data.push({
        x: itox(i),
        y: itoy(i),
        value: piecesSnapshot[i]!,
      })
    }
  }

  const targetPxX = animatedPieceScale(targetX)
  const targetPxY = animatedPieceScale(targetY)
  const pieceSize = animatedPieceWidth.value
  const centerX = targetPxX + pieceSize / 2
  const centerY = targetPxY + pieceSize / 2

  // Show the 9 highlight immediately so it stays visible during converge
  nineHighlightData.value = { x: targetPxX, y: targetPxY, size: pieceSize }

  // Phase 2+3: scale-up the 9 then particle burst
  const startScaleUpAndBurst = async () => {
    boardClearAnimationData.value = []
    await nextTick()

    const scaledSize = pieceSize * 2.5
    const scaledX = targetPxX - (scaledSize - pieceSize) / 2
    const scaledY = targetPxY - (scaledSize - pieceSize) / 2

    createTimeline({
      defaults: { ease: 'outBack' },
      onComplete: async () => {
        nineHighlightData.value = null
        await nextTick()

        // Phase 3: Particle burst
        const particleCount = 14
        const particles: typeof particleBurstData.value = []
        const baseSize = pieceSize * 0.3
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5
          const distance = innerWidth.value * (0.5 + Math.random() * 0.5)
          const pSize = baseSize * (0.6 + Math.random() * 0.4)
          particles.push({
            x: centerX - pSize / 2,
            y: centerY - pSize / 2,
            targetX: centerX + Math.cos(angle) * distance - pSize / 2,
            targetY: centerY + Math.sin(angle) * distance - pSize / 2,
            size: pSize,
          })
        }

        particleBurstData.value = particles
        await nextTick()

        createTimeline({
          defaults: { ease: 'outCubic' },
          onComplete: async () => {
            particleBurstData.value = []
            await nextTick()
            callback()
          },
        })
          .add('.particleBurstPart', {
            duration: 2000,
            keyframes: [
              {
                x: (el: any) => `${particles[Number(el.id)].targetX}px`,
                y: (el: any) => `${particles[Number(el.id)].targetY}px`,
                width: `0px`,
                height: `0px`,
                opacity: 0,
              },
            ],
          })
      },
    })
      .add('.nineHighlightPiece', {
        duration: 250,
        x: `${scaledX}px`,
        y: `${scaledY}px`,
        width: `${scaledSize}px`,
        height: `${scaledSize}px`,
      })
      .add('.nineHighlightPiece', {
        duration: 350,
      })
      .add('.nineHighlightPiece', {
        duration: 150,
        opacity: 0,
      })
  }

  // Phase 1: converge all other pieces toward the 9, or skip if none
  if (data.length > 0) {
    boardClearAnimationData.value = data
    await nextTick()

    const convergeTimeline = createTimeline({
      defaults: {
        ease: 'inOutQuad',
      },
      onComplete: startScaleUpAndBurst,
    })

    convergeTimeline
      .add('.boardClearAnimationDataPart', {
        duration: 600,
        keyframes: [
          {
            x: `${targetPxX}px`,
            y: `${targetPxY}px`,
            width: `0px`,
            height: `0px`,
            opacity: 0.0,
          },
        ],
      }, 200)
  }
  else {
    await nextTick()
    startScaleUpAndBurst()
  }
}

function place(i: number, value: number) {
  // only place if the spot is empty
  if (value === 0 && !props.unclickable)
    emit('animatedPlace', itox(i), itoy(i), animateConnection, animateBoardClear)
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
          :key="`connectionAnimationDataPart${i}`"
          :class="`${d.level === 1 ? 'level1ConnectionAnimationDataPart' : 'level2ConnectionAnimationDataPart'} piece piece-${d.value}`"
          :rx="pieceRadius"
          :ry="pieceRadius"
          :x="d.x < d.parentX ? animatedPieceScale(d.x) : animatedPieceScale(d.parentX)"
          :y="d.y < d.parentY ? animatedPieceScale(d.y) : animatedPieceScale(d.parentY)"
          :width="d.x === d.parentX ? animatedPieceWidth : twoAnimatedPiecesWidth"
          :height="d.y === d.parentY ? animatedPieceWidth : twoAnimatedPiecesWidth"
        />
      </g>
      <g>
        <rect
          v-for="(d, i) in boardClearAnimationData"
          :id="i.toString()"
          :key="`boardClearAnimationDataPart${i}`"
          :class="`boardClearAnimationDataPart piece piece-${d.value}`"
          :rx="pieceRadius"
          :ry="pieceRadius"
          :x="animatedPieceScale(d.x)"
          :y="animatedPieceScale(d.y)"
          :width="animatedPieceWidth"
          :height="animatedPieceWidth"
        />
      </g>
      <g>
        <rect
          v-for="(d, i) in particleBurstData"
          :id="i.toString()"
          :key="`particleBurstPart${i}`"
          class="particleBurstPart piece piece-9"
          :rx="2"
          :ry="2"
          :x="d.x"
          :y="d.y"
          :width="d.size"
          :height="d.size"
        />
      </g>
      <rect
        v-if="nineHighlightData"
        class="nineHighlightPiece piece piece-9"
        :rx="pieceRadius"
        :ry="pieceRadius"
        :x="nineHighlightData.x"
        :y="nineHighlightData.y"
        :width="nineHighlightData.size"
        :height="nineHighlightData.size"
      />
    </g>
  </svg>
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
</style>
