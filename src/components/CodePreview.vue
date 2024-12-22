<script setup>
const props = defineProps({
  show: Boolean,
  code: String,
  language: String,
  onClose: Function
})
</script>

<template>
  <div v-if="show" class="code-preview-overlay" @click="onClose">
    <div class="code-preview-content" @click.stop>
      <div class="code-preview-header">
        <span class="code-preview-lang">{{ language || 'text' }}</span>
        <button class="code-preview-close" @click="onClose">✖️</button>
      </div>
      <div class="code-preview-body">
        <pre><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-preview-overlay {
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

.code-preview-content {
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.code-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.code-preview-lang {
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  text-transform: uppercase;
}

.code-preview-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.code-preview-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.code-preview-body {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 1.5rem;
  background: #1e1e1e;
}

.code-preview-body pre {
  margin: 0;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.4;
  color: #d4d4d4;
}

.code-preview-body code {
  white-space: pre;
  word-break: normal;
  display: block;
  text-align: left;
}

.code-preview-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-preview-body::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.code-preview-body::-webkit-scrollbar-thumb {
  background: #3d3d3d;
  border-radius: 4px;
}

.code-preview-body::-webkit-scrollbar-thumb:hover {
  background: #4d4d4d;
}
</style> 