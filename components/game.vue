<script setup lang="ts">
const { settings } = useGameStore();

const boardPieces = ref(Array(settings.boardSize * settings.boardSize).fill(0));
const selectorPieces = ref(Array(settings.selectorCount).fill(0));
const selectedIndex = ref(0);
</script>

<template>
  <div>
    <Board :pieces="boardPieces" :padding="10" :width="400" :board-size="settings.boardSize" />
    <Selector
      :pieces="selectorPieces"
      :selected-index="selectedIndex"
      :selector-count="settings.selectorCount"
      :padding="10"
      :width="200"
    />
  </div>
</template>

<style>

</style>
