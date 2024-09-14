<script setup lang="ts">
import type { ConnectionAnimationDataPart } from '~~/interfaces'
import anime from 'animejs/lib/anime.es'

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
  animatedPlace: [x: number, y: number, animationCallback: any]
}>()

const connectionAnimationData = ref(new Array<ConnectionAnimationDataPart>())

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

  const timeline = anime.timeline({
    easing: 'linear',
    duration: 150,
    complete: async () => {
      connectionAnimationData.value = []
      await nextTick()
      callback()
    },
  })

  // Level 2 animation: first half of the connection
  // Level 1 animation: second half (connecting to the placed piece)
  // Both animation consist of scaling the rectangles (or translate + scale)
  // and removing the opacity after done
  timeline
    .add({
      targets: '.level2ConnectionAnimationDataPart',
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
    .add({
      targets: '.level1ConnectionAnimationDataPart',
      keyframes: [
        {
          width: `${animatedPieceWidth.value}px`,
          height: `${animatedPieceWidth.value}px`,
          x: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentX)}px`,
          y: (el: any) => `${animatedPieceScale(connectionAnimationData.value[el.id].parentY)}px`,
        },
        { opacity: 0.0, duration: 50 },
      ],
      endDelay: 50,
    })
}

function place(i: number, value: number) {
  // only place if the spot is empty
  if (value === 0 && !props.unclickable)
    emit('animatedPlace', itox(i), itoy(i), animateConnection)
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
