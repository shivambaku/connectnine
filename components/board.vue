<script setup lang="ts">
import anime from 'animejs/lib/anime.es';
import { storeToRefs } from 'pinia';
import type { ConnectionAnimationDataPart } from '~~/interfaces';

const props = defineProps<{
  width: number
  padding: number
  piecePadding: number
  pieceRadius: number
}>();

const gameStore = useGameStore();
const { gameState, boardSize } = storeToRefs(gameStore);
const { place, animatedPlace } = gameStore;

const connectionAnimationData = ref(new Array<ConnectionAnimationDataPart>());

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
  return 2 * (animatedPieceWidth.value + props.piecePadding);
});

const itox = (i: number) => i % boardSize.value;

const itoy = (i: number) => Math.floor(i / boardSize.value);

const scale = (x: number) => {
  const t = x / boardSize.value;
  return innerWidth.value * t;
};

const animatedPieceScale = (x: number) => {
  return scale(x) + props.piecePadding;
};

const animateConnection = async (connectionAnimationDataArg: Array<ConnectionAnimationDataPart>, callback) => {
  connectionAnimationData.value = connectionAnimationDataArg;

  await nextTick();

  const timeline = anime.timeline({
    easing: 'linear',
    duration: 150,
    complete: async () => {
      connectionAnimationData.value = [];
      await nextTick();
      callback();
    },
  });

  // Level 2 animation: first half of the connection
  // Level 1 animation: second half (connecting to the placed piece)
  // Both animation consist of scaling the rectangles (or translate + scale)
  // and removing the opacity after done
  timeline
    .add({
      targets: '.level2ConnectionAnimationDataPart',
      keyframes: [
        {
          width: animatedPieceWidth.value,
          height: animatedPieceWidth.value,
          x: el => animatedPieceScale(connectionAnimationData.value[el.id].parentX),
          y: el => animatedPieceScale(connectionAnimationData.value[el.id].parentY),
        },
        { opacity: 0.0, duration: 0 },
      ],
    })
    .add({
      targets: '.level1ConnectionAnimationDataPart',
      keyframes: [
        {
          width: animatedPieceWidth.value,
          height: animatedPieceWidth.value,
          x: el => animatedPieceScale(connectionAnimationData.value[el.id].parentX),
          y: el => animatedPieceScale(connectionAnimationData.value[el.id].parentY),
        },
        { opacity: 0.0, duration: 50 },
      ],
      endDelay: 50,
    });
};

const placeClick = (i: number, value: number) => {
  // only place if the spot is empty
  if (value === 0)
    animatedPlace(itox(i), itoy(i), animateConnection);
    // place(itox(i), itoy(i));
};
</script>

<template>
  <svg
    class="board" :viewBox="`0 0 ${props.width} ${props.width}`"
  >
    <g :transform="`translate(${props.padding}, ${props.padding})`">
      <Piece
        v-for="(piece, i) in gameState.boardPieces" :key="i"
        :value="piece"
        :x="scale(itox(i))" :y="scale(itoy(i))"
        :width="pieceWidth"
        :padding="piecePadding"
        :radius="pieceRadius"
        @click="placeClick(i, piece)"
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
    </g></svg>
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

