<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  show: Boolean,
  onClose: Function
})

const settings = ref({
  backgroundEffect: 'none',
  style: 'default'
})

// 背景效果选项
const backgroundOptions = [
  { value: 'none', label: '无背景' },
  { value: 'leaves', label: '落叶飘落' },
  { value: 'snow', label: '冬日飘雪' }
]

// 预设样式选项
const styleOptions = [
  { 
    value: 'default', 
    label: '默认',
    desc: '简约现代的默认风格'
  },
  { 
    value: 'elegant', 
    label: '优雅',
    desc: '典雅的书卷气质风格',
    colors: {
      primary: '#2c3e50',
      accent: '#8e44ad'
    }
  },
  { 
    value: 'tech', 
    label: '科技',
    desc: '充满未来感的科技风格',
    colors: {
      primary: '#2980b9',
      accent: '#3498db'
    }
  },
  { 
    value: 'nature', 
    label: '自然',
    desc: '清新自然的生态风格',
    colors: {
      primary: '#27ae60',
      accent: '#2ecc71'
    }
  }
]

// 加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('projectSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
}

// 保存设置
const saveSettings = () => {
  localStorage.setItem('projectSettings', JSON.stringify(settings.value))
  window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings.value }))
  props.onClose()
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div v-if="show" class="settings-overlay" @click="onClose">
    <div class="settings-modal" @click.stop>
      <div class="settings-header">
        <h3>项目设置</h3>
        <button class="close-btn" @click="onClose">×</button>
      </div>
      
      <div class="settings-content">
        <div class="setting-item">
          <label>预设风格</label>
          <div class="style-grid">
            <div
              v-for="style in styleOptions"
              :key="style.value"
              :class="['style-card', { active: settings.style === style.value }]"
              @click="settings.style = style.value"
            >
              <div class="style-preview" :style="{
                background: style.colors ? `linear-gradient(135deg, ${style.colors.primary}, ${style.colors.accent})` : 'var(--primary-gradient)'
              }"></div>
              <div class="style-info">
                <h4>{{ style.label }}</h4>
                <p>{{ style.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="setting-item">
          <label>背景效果</label>
          <select v-model="settings.backgroundEffect">
            <option
              v-for="option in backgroundOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="settings-footer">
        <button class="cancel-btn" @click="onClose">取消</button>
        <button class="save-btn" @click="saveSettings">保存</button>
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
  z-index: 1001;
  padding: 1rem;
}

.settings-modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease-out;
}

.settings-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.settings-scroll::-webkit-scrollbar {
  width: 6px;
}

.settings-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.settings-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.settings-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.settings-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a2a43;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f5f7fa;
  color: #1a2a43;
}

.settings-content {
  padding: 1.5rem;
  overflow-y: auto;
}

.setting-item {
  margin-bottom: 2rem;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-item label {
  display: block;
  margin-bottom: 1rem;
  color: #1a2a43;
  font-weight: 500;
}

select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  background: white;
  color: #1a2a43;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

select:focus {
  outline: none;
  border-color: #5c6ac4;
  box-shadow: 0 0 0 3px rgba(92, 106, 196, 0.1);
}

.style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.style-card {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.style-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.style-card.active {
  border-color: var(--accent-color);
}

.style-preview {
  height: 80px;
  width: 100%;
}

.style-info {
  padding: 1rem;
}

.style-info h4 {
  margin: 0 0 0.5rem 0;
  font-family: var(--font-serif);
}

.style-info p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.theme-switch {
  display: flex;
  gap: 1rem;
}

.theme-btn {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.settings-footer {
  padding: 1.5rem;
  border-top: 1px solid #eef2f7;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f7fa;
  border: 1px solid #eef2f7;
  color: #666;
}

.save-btn {
  background: linear-gradient(135deg, #5c6ac4, #8bb8ff);
  border: none;
  color: white;
}

.cancel-btn:hover {
  background: #eef2f7;
  color: #1a2a43;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(92, 106, 196, 0.2);
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .settings-modal {
    width: 95%;
    max-height: 80vh;
  }

  .settings-header {
    padding: 1rem;
  }

  .settings-content {
    padding: 1rem;
  }

  .settings-footer {
    padding: 1rem;
  }

  .cancel-btn,
  .save-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }
}
</style> 