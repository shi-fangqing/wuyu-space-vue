<script setup>
import { ref } from 'vue'
import ChatWindow from '@/components/ChatWindow.vue'

// AI功能卡片数据
const aiFeatures = ref([
  {
    icon: '🤖',
    title: '智能对话',
    desc: '基于大语言模型，提供智能对话服务'
  },
  {
    icon: '📝',
    title: '代码助手',
    desc: '代码编写、调试和优化的智能助手'
  },
  {
    icon: '💡',
    title: '问题解答',
    desc: '技术问题的智能解答和建议'
  }
])
</script>

<template>
  <div class="space-home">
    <!-- 顶部标题区 -->
    <section class="hero">
      <h1>勿语</h1>
      <p class="subtitle">AI智能助手 | 全能帮手</p>
    </section>

    <!-- AI功能展示区 -->
    <section class="features">
      <div class="feature-grid">
        <div 
          v-for="feature in aiFeatures"
          :key="feature.title"
          class="feature-card"
        >
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 聊天窗口 -->
    <section class="chat-section">
      <h2>有什么可以帮到你的吗？</h2>
      <ChatWindow />
    </section>

    <!-- 底部说明文字 -->
    <section class="description">
      <p>基于大语言模型，提供智能对话、代码编写、问题解答等服务</p>
      <p>24小时在线，随时为您提供帮助</p>
    </section>
  </div>
</template>

<style scoped>
.space-home {
  text-align: center;
}

.hero {
  padding: 3rem 0;
}

.hero h1 {
  font-size: 3rem;
  color: #1a2a43;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  color: #666;
}

.features {
  padding: 2rem 0;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  color: #1a2a43;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
}

.description {
  padding: 3rem 0;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}

.chat-section {
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 2rem;
}

.chat-section h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@media (max-width: 768px) {
  .chat-section {
    margin: 2rem auto;
    padding: 1.5rem;
  }
  
  .chat-section h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}
</style>
