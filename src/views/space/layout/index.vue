<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Logo from '@/components/Logo.vue'

// 导航菜单
const navItems = ref([
  { name: '首页', path: '/space' },
  { name: '文章', path: '/space/articles' },
  { name: '项目', path: '/space/projects' },
  { name: '关于我', path: '/resume' }
])

// 控制导航栏显示/隐藏
const isHeaderVisible = ref(true)
const lastScrollTop = ref(0)
const scrollThreshold = 100 // 滚动阈值

// 处理滚动事件
const handleScroll = () => {
  const currentScrollTop = window.scrollY
  
  // 判断滚动方向和距离
  if (currentScrollTop > lastScrollTop.value && currentScrollTop > scrollThreshold) {
    // 向下滚动且超过阈值，隐藏导航栏
    isHeaderVisible.value = false
  } else {
    // 向上滚动或回到顶部，显示导航栏
    isHeaderVisible.value = true
  }
  
  lastScrollTop.value = currentScrollTop
}

// 添加和移除滚动监听
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="space-layout">
    <!-- 顶部导航栏 -->
    <header :class="['header', { 'header-hidden': !isHeaderVisible }]">
      <router-link to="/space" class="logo-link">
        <Logo size="medium" />
      </router-link>
      <nav class="nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :exact="item.path === '/space'"
          active-class=""
          exact-active-class="active"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </header>

    <!-- 主要内容区 -->
    <main class="main">
      <router-view></router-view>
    </main>

    <!-- 底部区域 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>关于我</h3>
          <p>全栈工程师 | Java & Vue开发者</p>
          <p>热爱技术，追求创新</p>
        </div>
        <div class="footer-section">
          <h3>联系方式</h3>
          <p>邮箱：your.email@example.com</p>
          <p>GitHub：github.com/yourusername</p>
        </div>
        <div class="footer-section">
          <h3>友情链接</h3>
          <a href="#" target="_blank">个人博客</a>
          <a href="#" target="_blank">GitHub</a>
          <a href="#" target="_blank">掘金页</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 勿语. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.space-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #24385b 0%, #1a2a43 100%);
  padding: 0.7rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: transform 0.3s ease;
}

.header-hidden {
  transform: translateY(-100%);
}

.logo {
  color: transparent;
  font-size: 1.3rem;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
  background: linear-gradient(
    to right,
    #ff6b6b,
    #ffd93d,
    #6ce5b1,
    #4cc9f0,
    #8b5cf6
  );
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 200% auto;
  animation: rainbow 4s linear infinite;
}

.logo:hover {
  opacity: 0.9;
  animation: rainbow 1s linear infinite;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-item {
  font-family: var(--font-sans);
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  color: white;
  background-color: rgba(255,255,255,0.1);
}

.nav-item.active {
  color: white;
  background-color: rgba(255,255,255,0.15);
  font-weight: 500;
  box-shadow: 0 0 20px rgba(139, 184, 255, 0.1);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #8bb8ff, #5c6ac4);
  border-radius: 3px 3px 0 0;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: 0.5s;
}

.nav-item.active:hover::before {
  left: 100%;
}

.main {
  margin-top: 60px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 2rem;
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 0.7rem 1rem;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    height: auto;
  }

  .logo {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }

  .nav-item {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }

  .main {
    margin-top: 140px;
    padding: 1rem;
  }

  .search-section,
  .article-list,
  .project-grid {
    margin-top: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .header {
    padding: 0.8rem 1.5rem;
  }

  .nav {
    gap: 1.5rem;
  }

  .main {
    margin-top: 70px;
  }
}

/* 添加底部样式 */
.footer {
  background: linear-gradient(135deg, #24385b 0%, #1a2a43 100%);
  color: white;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #8bb8ff;
}

.footer-section p {
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.footer-section a {
  display: block;
  color: white;
  text-decoration: none;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.footer-section a:hover {
  opacity: 1;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-bottom p {
  opacity: 0.6;
}

/* 调整主内容区样式，确保footer始终底部 */
.space-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    text-align: center;
  }
}

/* 彩虹渐变动画 */
@keyframes rainbow {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}

/* 添加一个占位元素，用于撑开顶部空间 */
.space-layout::before {
  content: '';
  display: block;
  height: 60px; /* 与 header 默认高度相同 */
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 0.7rem 1rem;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    height: auto;
  }

  /* 移动端下调整占位元素高度 */
  .space-layout::before {
    height: 120px; /* 根据移动端 header 高度调整 */
  }

  .logo {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }

  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
  }

  .nav-item {
    font-size: 0.95rem;
    padding: 0.4rem 0.8rem;
  }

  .main {
    padding: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .space-layout::before {
    height: 70px;
  }
}

.logo-link {
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}
</style>
