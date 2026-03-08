<script setup lang="ts">
const props = defineProps<{
  value: number
  x: number
  y: number
  width: number
  padding: number
  radius: number
}>()

const innerWidth = computed(() => {
  return props.width - 2 * props.padding
})

const styleClass = computed(() => {
  return `piece-${props.value}`
})
</script>

<template>
  <g :transform="`translate(${props.padding}, ${props.padding})`">
    <rect
      :class="`piece ${styleClass}`"
      :rx="props.radius"
      :ry="props.radius"
      :x="props.x"
      :y="props.y"
      :width="innerWidth"
      :height="innerWidth"
    />
    <text
      v-if="props.value !== 0"
      class="piece-text no-select"
      dominant-baseline="central"
      text-anchor="middle"
      :font-size="innerWidth / 3"
      :x="props.x"
      :y="props.y"
      :dx="innerWidth / 2"
      :dy="innerWidth / 2"
    >
      {{ props.value }}
    </text>
  </g>
</template>

<style>
.piece-text {
  fill: var(--game-foreground-color);
  font-weight: 900;
  /* font-size: 22px; */
}

.piece.piece-0 {
  fill: #1F78B4;
  opacity: 0.20;
}

@media(hover: hover) and (pointer: fine) {
  .game:not(.paused):not(.loading) .piece.piece-0:hover {
    opacity: 1.0;
    cursor: pointer;
  }
}

.piece.piece-1 {
  fill: #FFFFB3;
}

.piece.piece-2 {
  fill: #BEBADA;
}

.piece.piece-3 {
  fill: #FB8072;
}

.piece.piece-4 {
  fill: #80B1D3;
}

.piece.piece-5 {
  fill: #FDB462;
}

.piece.piece-6 {
  fill: #B3DE69;
}

.piece.piece-7 {
  fill: #FCCDE5;
}

.piece.piece-8 {
  fill: #D9D9D9;
}

.piece.piece-9 {
  fill: #BC80BD;
}

.selector .selected .piece {
  stroke: #1F78B4;
  stroke-width: 5px;
}

.score .piece {
  stroke: var(--game-foreground-color);
  stroke-opacity: 0.5;
  stroke-width: 1px;
}

@media(hover: hover) and (pointer: fine) {
  .game:not(.paused) .selector .piece-text {
    cursor: pointer;
  }
}

@media(hover: hover) and (pointer: fine) {
  .game:not(.paused) .selector .piece:hover {
    cursor: pointer;
  }
}
</style>
