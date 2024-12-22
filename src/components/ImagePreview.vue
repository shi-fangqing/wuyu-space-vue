<script setup>
const props = defineProps({
  show: Boolean,
  imageUrl: String,
  onClose: Function
})
</script>

<template>
  <div v-if="show" class="image-preview-overlay" @click="onClose">
    <div class="image-preview-content" @click.stop>
      <img :src="imageUrl" alt="预览图片">
      <div class="image-preview-actions">
        <button class="preview-btn close" @click.stop="onClose" title="关闭">
          <span class="icon">✖️</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-preview-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.image-preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-preview-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
}

.image-preview-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-content:hover .image-preview-actions {
  opacity: 1;
}

.preview-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  color: white;
}

.preview-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-2px);
}

.preview-btn .icon {
  font-size: 1rem;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .image-preview-actions {
    opacity: 1; /* 移动端始终显示按钮 */
    top: 0.5rem;
    right: 0.5rem;
  }

  .preview-btn {
    width: 32px;
    height: 32px;
  }

  .preview-btn .icon {
    font-size: 0.9rem;
  }
}
</style> 