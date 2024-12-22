<script setup>
import { ref, watch } from 'vue'
import aiChatService from '../utils/AiChat.js'

const props = defineProps({
  show: Boolean,
  onClose: Function,
  onSave: Function,
  currentSettings: {
    type: Object,
    default: () => ({
      model: 'glm-4'
    })
  }
})

// 模型选项
const models = [
  { value: 'glm-4', label: 'GLM-4 (文本)' },
  { value: 'cogview-3', label: 'CogView-3 (图像生成)' },
  { value: 'glm-4v', label: 'GLM-4V (图像理解)' },
  { value: 'cogvideox', label: 'CogVideoX (视频生成)' }
]

// 使用计算属性来跟踪当前设置
const settings = ref({
  model: props.currentSettings.model
})

// 监听 currentSettings 的变化
watch(() => props.currentSettings, (newSettings) => {
  settings.value = { ...newSettings }
}, { deep: true })

const handleSave = () => {
  props.onSave(settings.value)
  props.onClose()
}
</script>

<template>
  <div v-if="show" class="settings-overlay" @click="onClose">
    <div class="settings-modal" @click.stop>
      <div class="settings-header">
        <h3>助手设置</h3>
        <button class="close-btn" @click="onClose">×</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-item">
          <label>模型选择</label>
          <select v-model="settings.model">
            <option v-for="model in models" 
                    :key="model.value" 
                    :value="model.value"
            >
              {{ model.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="settings-footer">
        <button class="cancel-btn" @click="onClose">取消</button>
        <button class="save-btn" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.settings-modal {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 500px;
  box-shadow: var(--shadow-lg);
}

.settings-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.5rem;
}

.settings-content {
  padding: 1.5rem;
}

.setting-item {
  margin-bottom: 1.5rem;
}

.setting-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
}

.setting-item select,
.setting-item textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.setting-item textarea {
  resize: vertical;
  min-height: 100px;
}

.settings-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.save-btn {
  background: var(--primary-gradient);
  color: white;
}

.cancel-btn:hover {
  background: #e4e7eb;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
</style> 