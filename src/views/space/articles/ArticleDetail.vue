<script setup>
import { ref, onMounted } from 'vue'
import { loadArticle } from '@/utils/markdown'

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  onClose: {
    type: Function,
    required: true
  }
})

const articleContent = ref('')

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

onMounted(async () => {
  const fullArticle = await loadArticle(props.article.id)
  articleContent.value = fullArticle.content
  console.log(articleContent.value)
})
</script>

<template>
  <div class="article-detail-overlay" @click="onClose">
    <div class="article-detail" @click.stop>
      <button class="close-btn" @click="onClose">×</button>
      
      <div class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <span>{{ formatDate(article.date) }}</span>
          <span>{{ article.category }}</span>
        </div>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
      
      <div class="article-content">
        <div v-html="articleContent"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-detail-overlay {
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
  padding: 2rem;
}

.article-detail {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #1a2a43;
}

.article-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eef2f7;
}

.article-header h1 {
  font-size: 2rem;
  color: #1a2a43;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f2f5;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

.article-content {
  color: #444;
  line-height: 1.8;
}

.description {
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .article-detail-overlay {
    padding: 1rem;
  }
  
  .article-detail {
    padding: 1.5rem;
  }
  
  .article-header h1 {
    font-size: 1.5rem;
  }
}
</style> 