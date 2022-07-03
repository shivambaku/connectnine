<script setup lang="ts">
import type { AnimationData, ConnectionAnimationDataPart } from '~~/interfaces';

const props = defineProps<{
  pieces: Array<number>
  width: number
  padding: number
  piecePadding: number
  pieceRadius: number
  connectionsAnimationData: Array<Array<ConnectionAnimationDataPart>>
}>();

const emit = defineEmits<{
  (e: 'place', x: number, y: number)
}>();

const boardSize = computed(() => {
  return Math.sqrt(props.pieces.length);
});

const innerWidth = computed(() => {
  return props.width - 2 * props.padding;
});

const pieceWidth = computed(() => {
  return innerWidth.value / boardSize.value;
});

const animatedPieceWidth = computed(() => {
  return pieceWidth.value - 2 * props.piecePadding;
});

const twoAnimatedPiecesWidth = computed(() => {
  return 2 * (animatedPieceWidth.value * props.piecePadding);
});

const itox = (i: number) => i % boardSize.value;

const itoy = (i: number) => Math.floor(i / boardSize.value);

const scale = (x: number) => {
  const t = x / boardSize.value;
  return innerWidth.value * t;
};

const animtedPieceScale = (x: number) => {
  return scale(x) + props.piecePadding;
};

const place = (i: number, value: number) => {
  if (value === 0)
    emit('place', itox(i), itoy(i));
};

watch(props.connectionsAnimationData, async () => {
  console.log(props.connectionsAnimationData);
});
</script>

<template>
  <svg
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
          v-for="(connectionAnimationDataPart, i) in connectionsAnimationData[0]"
          :key="`connectionAnimationDataPart${i}`"
          :rx="pieceRadius"
          :ry="pieceRadius"
          :width="connectionAnimationDataPart.x === connectionAnimationDataPart.parentX ? animatedPieceWidth : twoAnimatedPiecesWidth"
          :height="connectionAnimationDataPart.y === connectionAnimationDataPart.parentY ? animatedPieceWidth : twoAnimatedPiecesWidth"
        />
      </g>
    </g></svg>
</template>

<style scoped>
.board {
  border-radius: 10px;
  background: var(--background-color);
  margin: 10px 0px;
}

.aniamted-piece {
  pointer-events: none;
}
</style>

