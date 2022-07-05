<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>();

defineEmits<{
  (e: 'click', payload: MouseEvent)
}>();
</script>

<template>
  <div :class="`button ${disabled ? 'disabled' : ''}`" @click="(e) => $emit('click', e)">
    <slot />
  </div>
</template>

<style scoped>
.button {
  background: var(--background-color);
  color: var(--foreground-color);
  padding: 8px 15px;
  border-radius: 10px;
  text-transform: lowercase;
  font-style: italic;
  float: left;
  user-select: none;
}

@media(hover: hover) and (pointer: fine) {
  .button:hover {
    background: var(--background-color);
    color: var(--foreground-color);
    cursor: pointer;
  }
}

.button.disabled {
  opacity: 0.7;
  pointer-events:none;
}

.dark .button.disabled {
  opacity: 0.5;
  pointer-events:none;
}
</style>
