<script setup lang="ts">
const props = defineProps({
  pieces: Array<number>,
  width: Number,
  padding: Number,
  boardSize: Number,
});

const innerWidth = computed(() => {
  return props.width - 2 * props.padding;
});

const pieceWidth = computed(() => {
  return innerWidth.value / props.boardSize;
});

const itox = (i: number) => i % props.boardSize;
const itoy = (i: number) => Math.floor(i / props.boardSize);
const scale = (value: number) => {
  const t = value / props.boardSize;
  return innerWidth.value * t;
};
</script>

<template>
  <svg
    class="board" :viewBox="`0 0 ${props.width} ${props.width}`"
  >
    <g :transform="`translate(${props.padding}, ${props.padding})`">
      <Piece v-for="(piece, i) in pieces" :key="i" :value="piece" :x="scale(itox(i))" :y="scale(itoy(i))" :width="pieceWidth" :padding="4" :radius="6" />
    </g>
  </svg>
</template>

<style>
.board {
  border-radius: 10px;
  background: var(--background-color);
  margin: 10px 0px;
}
</style>

