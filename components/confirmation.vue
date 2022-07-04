<script setup lang="ts">
const props = defineProps<{
  x: number
  y: number
  width: number
  padding: number
  text: string
}>();
</script>

<template>
  <svg
    class="confirmation"
    :x="x"
    :y="y"
    :width="width"
    :height="width"
  >
    <g>
      <rect :width="width" :height="width" />
      <text
        class="confirmation-text noselect"
        dominant-baseline="central"
        text-anchor="middle"
        :x="width / 2"
        :y="width / 3"
      >
        {{ text }}
      </text>
    </g>
  </svg>
</template>

<style scoped>
.confirmation {
  border-radius: 10px;
  fill: var(--game-background-color);
  margin: 10px 0px;
}

.confirmation-text {
  fill: var(--game-foreground-color);
  font-weight: 900;
  font-size: 22px;
}
</style>
