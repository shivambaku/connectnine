<script setup lang="ts">
defineProps<{
  text: string
}>();

defineEmits<{
  yes: [payload: MouseEvent]
  no: [payload: MouseEvent]
}>();
</script>

<template>
  <div class="confirmation">
    <div class="confirmation-text">
      {{ text }}
    </div>
    <div class="confirmation-buttons">
      <div style="margin: auto;">
        <Button @click="(e) => $emit('yes', e)">
          Yes
        </Button>
        <Button style="margin-left: 20px" @click="(e) => $emit('no', e)">
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
  width: 100%;
  height: 100%;
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

@media screen and (max-width: 400px) {
  .confirmation-text {
    font-size: 18px;
  }
}

.confirmation-buttons {
  position: absolute;
  top: 55%;
  width: 100%;
  display: flex;
}
</style>
