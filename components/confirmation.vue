<script setup lang="ts">
defineProps<{
  width: number
  text: string
}>();

defineEmits<{
  (e: 'yes', payload: MouseEvent)
  (e: 'no', payload: MouseEvent)
}>();
</script>

<template>
  <div class="confirmation" relative :style="{ width: `${width}px`, height: `${150}px` }">
    <div class="confirmation-text">
      {{ text }}
    </div>
    <div class="confirmation-buttons">
      <div m-auto>
        <Button @click="(e) => $emit('yes', e)">
          Yes
        </Button>
        <Button ml-20px @click="(e) => $emit('no', e)">
          No
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation {
  border-radius: 10px;
  background: var(--background-color);
  opacity: 95%;
}

.confirmation-text {
  position: absolute;
  color: var(--foreground-color);
  font-weight: 900;
  font-size: 22px;
  top: 30%;
  width: 100%;
  user-select: none;
}

.confirmation-buttons {
  position: absolute;
  top: 55%;
  width: 100%;
  display: flex;
}
</style>
