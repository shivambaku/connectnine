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
  fill-opacity: 0.20;
}

@media(hover: hover) and (pointer: fine) {
  .game:not(.paused):not(.loading) .piece.piece-0:hover {
    fill-opacity: 1.0;
    cursor: pointer;
  }
}

.game:not(.paused):not(.loading) .piece.piece-0:active {
  fill-opacity: 0.6;
}

.piece.piece-1 {
  fill: var(--piece-color-1);
}

.piece.piece-2 {
  fill: var(--piece-color-2);
}

.piece.piece-3 {
  fill: var(--piece-color-3);
}

.piece.piece-4 {
  fill: var(--piece-color-4);
}

.piece.piece-5 {
  fill: var(--piece-color-5);
}

.piece.piece-6 {
  fill: var(--piece-color-6);
}

.piece.piece-7 {
  fill: var(--piece-color-7);
}

.piece.piece-8 {
  fill: var(--piece-color-8);
}

.piece.piece-9 {
  fill: var(--piece-color-9);
}

.selector .selected .piece {
  stroke: #1F78B4;
  stroke-width: 5px;
}

.score .piece {
  stroke: var(--game-foreground-color);
  stroke-opacity: 0.5;
  stroke-width: 1px;
  pointer-events: none;
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
