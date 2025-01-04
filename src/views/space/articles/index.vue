<template>
  <div class="articles">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="搜索文章..."
          class="search-input"
        >
        <span class="search-icon">🔍</span>
      </div>
      
      <!-- 标签过滤器 -->
      <div class="tags-filter">
        <div 
          v-for="tag in allTags"
          :key="tag"
          :class="['filter-tag', { active: selectedTags.includes(tag) }]"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="article-list">
      <div v-if="filteredArticles.length === 0" class="no-results">
        没有找到匹配的文章
      </div>
      <div 
        v-else
        v-for="article in filteredArticles" 
        :key="article.id" 
        class="article-card"
        @click="showArticleDetail(article)"
      >
        <h2>{{ article.title }}</h2>
        <div class="article-meta">
          <span>{{ formatDate(article.date) }}</span>
          <span>{{ article.category }}</span>
        </div>
        <p class="article-desc">{{ article.description }}</p>
        <div class="article-tags">
          <span 
            v-for="tag in article.tags" 
            :key="tag" 
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 文章详情弹窗 -->
    <ArticleDetail
      v-if="selectedArticle"
      :article="selectedArticle"
      :onClose="closeArticleDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { loadArticles } from '@/utils/markdown'
import ArticleDetail from './ArticleDetail.vue'

// 文章数据
const articles = ref([])
const searchQuery = ref('')
const selectedTags = ref([])

// 加载文章数据
const loadArticleData = async () => {
  articles.value = await loadArticles()
}

onMounted(async () => {
  await loadArticleData()
})

// 获取所有标签
const allTags = computed(() => {
  const tags = new Set()
  articles.value.forEach(article => {
    article.tags.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// 过滤文章
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    // 标题或描述匹配搜索词
    const matchesSearch = searchQuery.value === '' || 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 标签匹配
    const matchesTags = selectedTags.value.length === 0 || 
      selectedTags.value.every(tag => article.tags.includes(tag))
    
    return matchesSearch && matchesTags
  })
})

// 切换标签选择
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// 文章详情相关
const selectedArticle = ref(null)

const showArticleDetail = (article) => {
  selectedArticle.value = article
}

const closeArticleDetail = () => {
  selectedArticle.value = null
}

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>

<style scoped>
.articles {
  padding: 1rem 2rem;
}

.article-list {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.article-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.3s;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-card h2 {
  font-family: var(--font-serif);
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

.article-desc {
  font-family: var(--font-sans);
  color: #444;
  line-height: 1.6;
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

/* 搜索区域样式 */
.search-section {
  margin: 3rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.search-input {
  width: 100%;
  padding: 1.2rem 1rem 1.2rem 3rem;
  border: 2px solid #eef2f7;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: transparent;
}

.search-input:focus {
  border-color: #8bb8ff;
  box-shadow: 0 0 0 3px rgba(139, 184, 255, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-size: 1.2rem;
}

.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
}

.filter-tag {
  padding: 0.5rem 1rem;
  background: #f0f2f5;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-tag:hover {
  background: #e4e7eb;
}

.filter-tag.active {
  background: #1a2a43;
  color: white;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .search-section {
    margin: 2rem 0 1.5rem;
  }
  
  .search-input {
    padding: 0.8rem 0.8rem 0.8rem 2.5rem;
  }
  
  .search-icon {
    left: 0.8rem;
  }
  
  .tags-filter {
    gap: 0.5rem;
  }
  
  .filter-tag {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}
</style> 