<script setup>
import { ref } from 'vue'

const props = defineProps({
  show: Boolean,
  currentAvatar: String,
  onClose: Function,
  onSelect: Function
})

// 预设头像列表
const avatars = [
  {
    id: 'robot1',
    emoji: '🤖',
    name: '机器人'
  },
  {
    id: 'cat',
    emoji: '🐱',
    name: '猫咪助手'
  },
  {
    id: 'alien',
    emoji: '👽',
    name: '外星助手'
  },
  {
    id: 'ghost',
    emoji: '👻',
    name: '幽灵助手'
  },
  {
    id: 'angel',
    emoji: '👼',
    name: '天使助手'
  },
  {
    id: 'wizard',
    emoji: '🧙‍♂️',
    name: '巫师助手'
  },
  {
    id: 'ninja',
    emoji: '🥷',
    name: '忍者助手'
  },
  {
    id: 'scientist',
    emoji: '👨‍🔬',
    name: '科学家助手'
  }
]

const handleSelect = (avatar) => {
  props.onSelect(avatar)
  props.onClose()
}
</script>

<template>
  <div v-if="show" class="avatar-selector-overlay" @click="onClose">
    <div class="avatar-selector" @click.stop>
      <div class="selector-header">
        <h3>选择头像</h3>
        <button class="close-btn" @click="onClose">×</button>
      </div>
      
      <div class="avatars-grid">
        <div
          v-for="avatar in avatars"
          :key="avatar.id"
          :class="['avatar-item', { active: currentAvatar === avatar.emoji }]"
          @click="handleSelect(avatar)"
        >
          <span class="avatar-emoji">{{ avatar.emoji }}</span>
          <span class="avatar-name">{{ avatar.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-selector-overlay {
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

.avatar-selector {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.selector-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selector-header h3 {
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

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
}

.avatar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-item:hover {
  background: var(--bg-primary);
  transform: translateY(-2px);
}

.avatar-item.active {
  background: var(--primary-gradient);
  color: white;
}

.avatar-emoji {
  font-size: 2rem;
}

.avatar-name {
  font-size: 0.8rem;
  text-align: center;
}
</style> 