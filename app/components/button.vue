<script setup lang="ts">
defineProps<{
  disabled?: boolean
  loading?: boolean
}>();

defineEmits<{
  click: [e: MouseEvent]
}>();
</script>

<template>
  <div v-if="loading" :class="`button skeleton`"><slot /></div>
  <div v-else :class="`button ${disabled ? 'disabled' : ''}`" @click="(e) => $emit('click', e)">
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

.button.skeleton {
  opacity: 0.5;
  color: transparent !important;
}

@media(hover: hover) and (pointer: fine) {
  .button:not(.skeleton):hover {
    background: var(--background-color);
    color: var(--accent-color);
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
