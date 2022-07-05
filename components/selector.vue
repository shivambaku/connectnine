<script setup lang="ts">
const props = defineProps<{
  width: number
  padding: number
  pieces: Array<number>
  selectedIndex: number
}>();

defineEmits<{
  (e: 'select', i: number)
}>();

const selectorCount = computed(() => {
  return props.pieces.length;
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
        v-for="(piece, i) in pieces"
        :key="i"
        :class="i === selectedIndex ? 'selected' : ''"
        :value="piece"
        :x="scale(i)"
        :y="0"
        :width="pieceWidth"
        :padding="4"
        :radius="6"
        @click="() => $emit('select', i)"
      />
    </g>
  </svg>
</template>

<style scoped>
.selector {
  border-radius: 10px;
  background: var(--game-background-color);
}
</style>
