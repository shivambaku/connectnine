<script setup lang="ts">
const props = defineProps<{
  loading: boolean
  width: number
  padding: number
  pieces: Array<number> | undefined
  selectedIndex: number
  unclickable?: boolean
}>();

const emit = defineEmits<{
  select: [i: number]
}>();

const selectorCount = computed(() => {
  if (props.loading) return 3;
  return props.pieces!.length;
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

const select = (i: number) => {
  if (!props.unclickable)
    emit('select', i);
};
</script>

<template>
  <svg v-if="loading" class="selector skeleton" :width="width" :height="height">
    <g :transform="`translate(${padding}, ${padding})`">
      <Piece
        v-for="(piece, i) in [0, 0, 0]"
        :key="i"
        :class="i === selectedIndex ? 'selected' : ''"
        :value="piece"
        :x="scale(i)"
        :y="0"
        :width="pieceWidth"
        :padding="4"
        :radius="6"
      />
    </g>
  </svg>
  <svg v-else class="selector" :width="width" :height="height">
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
        @click="select(i)"
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
