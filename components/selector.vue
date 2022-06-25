<script setup lang="ts">
const props = defineProps<{
  selectorCount: number
  pieces: Array<number>
  selectedIndex: number
  width: number
  padding: number
}>();

defineEmits<{
  (e: 'select', i: number)
}>();

const innerWidth = computed(() => {
  return props.width - 2 * props.padding;
});

const pieceWidth = computed(() => {
  return innerWidth.value / props.selectorCount;
});

const height = computed(() => {
  return pieceWidth.value + props.padding * 2.0;
});

const scale = (value: number) => {
  const t = value / props.selectorCount;
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

<style>
.selector {
  border-radius: 10px;
  background: var(--background-color);
}
</style>
