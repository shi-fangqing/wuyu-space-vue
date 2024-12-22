<script setup>
const props = defineProps({
  message: String,
  show: Boolean
})
</script>

<template>
  <Transition name="toast">
    <div v-if="show" class="toast">
      <span class="toast-icon">✓</span>
      <span class="toast-message">{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.toast-icon {
  color: #4CAF50;
}

.toast-message {
  font-size: 0.95rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 