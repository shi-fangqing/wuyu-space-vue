<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BackgroundEffect from './components/BackgroundEffect.vue'
import ProjectSettings from './components/ProjectSettings.vue'

const route = useRoute()
const showSettings = ref(false)
const backgroundType = ref('none')
const currentStyle = ref('default')

// 设置页面标题
const setPageTitle = (route) => {
  const titles = {
    '/space': '勿语的空间',
    '/space/articles': '文章 - 勿语的空间',
    '/space/projects': '项目 - 勿语的空间',
    '/resume': '个人简历 - 勿语的空间'
  }
  document.title = titles[route.path] || '勿语的空间'
}

// 监听路由变化
watch(() => route.path, (newPath) => {
  setPageTitle({ path: newPath })
})

// 加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('projectSettings')
  if (savedSettings) {
    const settings = JSON.parse(savedSettings)
    backgroundType.value = settings.backgroundEffect
    currentStyle.value = settings.style
    applyStyle(settings.style)
  }
}

// 监听设置变化
const handleSettingsChange = (event) => {
  const { backgroundEffect, style } = event.detail
  backgroundType.value = backgroundEffect
  currentStyle.value = style
  applyStyle(style)
}

// 应用预设样式
const applyStyle = (style) => {
  document.documentElement.setAttribute('data-style', style)
}

onMounted(() => {
  loadSettings()
  window.addEventListener('settingsChanged', handleSettingsChange)
  setPageTitle(route) // 初始化标题
})
</script>

<template>
  <div :class="['app', `style-${currentStyle}`]">
    <BackgroundEffect :type="backgroundType" />
    <router-view></router-view>
    <div class="settings-trigger" @click="showSettings = true">⚙️</div>
    <ProjectSettings
      :show="showSettings"
      :onClose="() => showSettings = false"
    />
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  position: relative;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.settings-trigger {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  width: 48px;
  height: 48px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  z-index: 1000;
}

.settings-trigger:hover {
  transform: rotate(-30deg);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .settings-trigger {
    bottom: 1rem;
    left: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>