<script setup lang="ts">
import { storeToRefs } from 'pinia';

const props = defineProps<{
  width: number
  padding: number
}>();

const gameStore = useGameStore();
const { gameState } = storeToRefs(gameStore);
const { select } = gameStore;

const selectorCount = computed(() => {
  return gameState.value.selectorPieces.length;
});

const innerWidth = computed(() => {
  return props.width - 2 * props.padding;
});

const pieceWidth = computed(() => {
  return innerWidth.value / selectorCount.value;
});

const height = computed(() => {
  return pieceWidth.value + props.padding * 2.0;
});

const scale = (value: number) => {
  const t = value / selectorCount.value;
  return innerWidth.value * t;
};
</script>

<template>
  <svg class="selector" :width="width" :height="height">
    <g :transform="`translate(${padding}, ${padding})`">
      <Piece
        v-for="(piece, i) in gameState.selectorPieces"
        :key="i"
        :class="i === gameState.selectedIndex ? 'selected' : ''"
        :value="piece"
        :x="scale(i)"
        :y="0"
        :width="pieceWidth"
        :padding="4"
        :radius="6"
        @click="() => select(i)"
      />
    </g>
  </svg>
</template>

<style scoped>
.selector {
  border-radius: 10px;
  background: var(--background-color);
}
</style>
