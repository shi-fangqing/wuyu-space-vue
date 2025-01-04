<script setup>
import { ref, onMounted } from 'vue'

// 图片墙数据
const images = ref([
  {
    id: 1,
    url: new URL('@/assets/img/1.png', import.meta.url).href,
    title: '风景摄影',
    desc: '大自然的鬼斧神工'
  },
  {
    id: 2,
    url: new URL('@/assets/img/2.png', import.meta.url).href,
    title: '城市掠影',
    desc: '现代都市的繁华'
  },
  {
    id: 3,
    url: new URL('@/assets/img/3.png', import.meta.url).href,
    title: '生活随笔',
    desc: '记录美好时刻'
  }
  // 可以继续添加更多图片
])

console.log(images.value)
// 动画状态
const hoveredImage = ref(null)

const setHoveredImage = (image) => {
  hoveredImage.value = image
}
</script>

<template>
  <div class="space-home">
    <!-- 顶部标题区 -->
    <section class="hero">
      <h1>勿语的空间</h1>
      <p class="subtitle">记录生活 | 分享技术 | 探索未知</p>
    </section>

    <!-- 动态图片墙 -->
    <section class="gallery">
      <div class="gallery-grid">
        <div
          v-for="image in images"
          :key="image.id"
          class="gallery-item"
          @mouseenter="setHoveredImage(image)"
          @mouseleave="setHoveredImage(null)"
        >
          <img :src="image.url" :alt="image.title">
          <div class="gallery-overlay" :class="{ active: hoveredImage === image }">
            <h3>{{ image.title }}</h3>
            <p>{{ image.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 简介区域 -->
    <section class="intro">
      <div class="intro-content">
        <h2>关于我的空间</h2>
        <p>这里是我的个人空间，记录着技术学习、生活感悟和创作分享。</p>
        <p>希望能在这里与你相遇，共同探讨，共同成长。</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.space-home {
  padding: 2rem;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero h1 {
  font-size: 3rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-family: var(--font-serif);
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  font-family: var(--font-sans);
}

.gallery {
  margin: 4rem 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.gallery-item {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-item:hover img {
  transform: scale(1.05);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8),
    rgba(0, 0, 0, 0.4),
    transparent
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gallery-overlay.active,
.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-overlay h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-family: var(--font-serif);
}

.gallery-overlay p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-family: var(--font-sans);
}

.intro {
  padding: 4rem 0;
  text-align: center;
}

.intro-content {
  max-width: 800px;
  margin: 0 auto;
}

.intro h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  font-family: var(--font-serif);
}

.intro p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
}

@media (max-width: 768px) {
  .space-home {
    padding: 1rem;
  }

  .hero {
    padding: 2rem 0;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gallery-overlay {
    padding: 1rem;
  }

  .gallery-overlay h3 {
    font-size: 1.2rem;
  }

  .intro {
    padding: 2rem 0;
  }

  .intro h2 {
    font-size: 1.5rem;
  }
}
</style>
