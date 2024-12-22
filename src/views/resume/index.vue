<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 轮播图配置
const banners = [
  {
    url: new URL('@/assets/banner/banner1.png', import.meta.url).href,
    title: '技术'
  },
  {
    url: new URL('@/assets/banner/banner2.png', import.meta.url).href,
    title: '创新'
  },
  {
    url: new URL('@/assets/banner/banner3.png', import.meta.url).href,
    title: '编程'
  }
]

const currentBanner = ref(0)
let bannerTimer = null

// 切换轮播图
const nextBanner = () => {
  currentBanner.value = (currentBanner.value + 1) % banners.length
}

// 控制返回顶部按钮的显示状态
const isBackToTopVisible = ref(false)

// 处理滚动事件
const handleScroll = () => {
  isBackToTopVisible.value = window.scrollY > 300
}

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 启动轮播
  bannerTimer = setInterval(nextBanner, 5000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  // 清除轮播定时器
  if (bannerTimer) clearInterval(bannerTimer)
})

// 移除颜色配置，使用统一样式
const skillsConfig = [
  'Spring Boot',
  'MyBatis-Plus',
  'Spring Cloud',
  'MySQL',
  'Redis',
  'RabbitMQ',
  'Vue.js',
  'JavaScript',
  'HTML5/CSS3',
  'Docker',
  'Nginx',
  'Linux',
  'Maven'
]
</script>

<template>
  <div class="resume">
    <div class="header">
      <!-- 轮播背景 -->
      <div class="banner-container">
        <div 
          v-for="(banner, index) in banners" 
          :key="index"
          :class="['banner', { active: index === currentBanner }]"
          :style="{ backgroundImage: `url(${banner.url})` }"
        ></div>
        <!-- 遮罩层 -->
        <div class="overlay"></div>
      </div>

      <nav class="nav-links">
        <router-link to="/space" class="back-link">← 返回空间</router-link>
      </nav>
      <div class="avatar">
        <img src="../../assets/avatar.png" alt="勿语的头像">
      </div>
      <h1>勿语</h1>
      <p class="subtitle">全栈工程师 | Java & Vue</p>
    </div>

    <div class="main">
      <!-- 关于我 -->
      <section class="about">
        <h2>关于我</h2>
        <p>我是一名全栈工程师，擅长Java后端开发和Vue前端开发。在企业级应用开发方面有丰富经验，能够独立完成前后端系统的设计与实现。热衷于编写高质量的代码，追求技术创新。</p>
      </section>

      <!-- 专业技能 -->
      <section class="skills">
        <h2>专业技能</h2>
        <ul>
          <li v-for="skill in skillsConfig" :key="skill">
            {{ skill }}
          </li>
        </ul>
      </section>

      <!-- 实习经历 -->
      <section class="experience">
        <h2>实习经历</h2>
        <div class="experience-card">
          <h3>博明(山西)健康管理有限公司</h3>
          <p class="position">Java 开发工程师 | 2024.03 — 2024.06</p>
          <div class="project">
            <h4>博明快药</h4>
            <p class="tech-stack">技术架构：SpringBoot + Vue + MySQL + Redis + RabbitMQ</p>
            <p class="project-desc">项目描述：面向医药零售行业的SaaS系统，为连锁药店提供完整的业务管理解决方案。</p>
            <p class="responsibilities">主要职责：</p>
            <ul>
              <li>设计并实现店铺资源管理模块，包括视频、音频、图片等多媒体资源的上传、存储和管理功能</li>
              <li>基于阿里云OSS实现资源的分布式存储，提高系统的扩展性和可用性</li>
              <li>使用Vue3封装通用的资源管理组件，实现了资源预览、上传进度显示等功能，提高了开发效率</li>
              <li>优化资源加载性能，实现资源的懒加载和CDN加速，提升了用户体验</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 项目经验 -->
      <section class="projects">
        <h2>项目经验</h2>
        <div class="project-card">
          <h3>易搬家 - 家政服务平台</h3>
          <p class="tech-stack">技术架构：SpringBoot + Vue3 + Element-Plus + MySQL + Redis + 微信小程序</p>
          <p class="project-desc">项目描述：一个连接用户与搬家服务商的综合性平台，提供在线预约、实时跟踪、评价反馈等功能，通过微信小程序实现便捷的移动端服务。</p>
          <p>核心贡献：</p>
          <ul>
            <li>设计并实现基于RBAC的权限控制系统，使用Spring Security + JWT实现认证授权，并通过AOP实现细粒度的接口权限控制</li>
            <li>实现基于Redis + Lua脚本的分布式限流方案，有效防止恶意请求和DDoS攻击，提升系统安全性</li>
            <li>设计并实现订单管理、车型管理、资费计算等核心业务模块，支持多种搬家场景的灵活定价</li>
            <li>使用多级缓存策略优化系统性能，通过Redis缓存热点数据，减少数据库压力</li>
            <li>集成短信服务(SMS)和对象存储服务(OSS)，实现订单通知、图片存储等功能，提升用户体验</li>
            <li>实现接口服务的降级和熔断机制，通过多个第三方接口的冗余策略，提高系统的可用性和稳定性</li>
          </ul>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="contact">
        <h2>联系方式</h2>
        <p>邮箱：your.email@example.com</p>
        <p>电话：+86 xxx xxxx xxxx</p>
      </section>
    </div>

    <div class="footer">
      <p>© 2024 勿语. 保留所有权利。</p>
    </div>

    <!-- 返回顶部按钮 -->
    <div 
      class="back-to-top" 
      :class="{ visible: isBackToTopVisible }"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24">
        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 轮播图样式 */
.banner-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.banner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
}

.banner.active {
  opacity: 1;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

/* 头部样式 */
.header {
  position: relative;
  background: linear-gradient(135deg, #24385b 0%, #1a2a43 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;
  z-index: 2;
}

.nav-links {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

.avatar {
  width: 140px;
  height: 140px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  position: relative;
  z-index: 1;
}

/* 主要内容样式 */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  position: relative;
  z-index: 3;
}

section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 2rem;
  color: #1a2a43;
  margin-bottom: 2rem;
  padding-bottom: 0.8rem;
  border-bottom: 2px solid #eef2f7;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(90deg, #5c6ac4, #8bb8ff);
}

/* 项目卡片样式 */
.project-card,
.experience-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.project-card::before,
.experience-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #5c6ac4, #8bb8ff);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover::before,
.experience-card:hover::before {
  opacity: 1;
}

.project-card h3,
.experience-card h3 {
  color: #1a2a43;
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.position {
  color: #666;
  margin-bottom: 1.5rem;
}

.tech-stack {
  color: #666;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.project-desc {
  color: #444;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.responsibilities {
  color: #1a2a43;
  font-weight: 500;
  margin-bottom: 0.8rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  color: #495057;
  line-height: 1.7;
  margin-bottom: 1rem;
  padding-left: 1.8rem;
  position: relative;
  transition: transform 0.2s ease;
}

li:hover {
  transform: translateX(5px);
}

li::before {
  content: '•';
  color: #5c6ac4;
  position: absolute;
  left: 0;
  font-weight: bold;
  font-size: 1.2em;
}

/* 技能标签统一风格 */
.skills ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.skills li {
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 500;
  color: #2c3e50;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(92, 106, 196, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  letter-spacing: 0.5px;
}

/* 移除之前的圆点样式 */
.skills li::before {
  display: none;
}

/* 玻璃态效果 */
.skills li::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(92, 106, 196, 0.1),
    transparent
  );
  transform: rotate(45deg);
  transition: 0.5s;
}

.skills li:hover {
  transform: translateY(-5px);
  border-color: rgba(92, 106, 196, 0.4);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 8px 25px rgba(92, 106, 196, 0.15);
}

.skills li:hover::after {
  left: 100%;
}

/* 点击效果 */
.skills li:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .skills li {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* 打印样式 */
@media print {
  .skills li {
    box-shadow: none !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    background: none !important;
    color: #2c3e50 !important;
  }
}

/* 联系方式样式 */
.contact p {
  color: #495057;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;
}

.contact p:hover {
  transform: translateX(5px);
  color: #1a2a43;
}

/* 页脚样式 */
.footer {
  text-align: center;
  padding: 3rem 2rem;
  color: #6c757d;
  border-top: 1px solid #eef2f7;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.02));
}

/* 返回顶部按钮 */
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #24385b 0%, #1a2a43 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top:hover {
  transform: translateY(-5px) rotate(360deg);
  transition: all 0.5s ease;
}

.back-to-top svg {
  width: 20px;
  height: 20px;
  fill: white;
}

@media (max-width: 768px) {
  .header {
    padding: 4rem 1rem;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  h2 {
    font-size: 1.6rem;
  }

  .project-card,
  .experience-card {
    padding: 1.8rem;
  }

  .skills li {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .back-to-top {
    right: 1rem;
    bottom: 1rem;
  }
}

/* 返回链接样式 */
.back-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.back-link:hover {
  opacity: 1;
}

/* 添加渐入动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为每个部分添加动画 */
section {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

section:nth-child(1) { animation-delay: 0.2s; }
section:nth-child(2) { animation-delay: 0.4s; }
section:nth-child(3) { animation-delay: 0.6s; }
section:nth-child(4) { animation-delay: 0.8s; }

/* 打印样式优化 */
@media print {
  .resume {
    padding: 0;
  }

  .header {
    padding: 2rem;
    background: none !important;
    color: #1a2a43;
  }

  .project-card,
  .experience-card {
    box-shadow: none;
    border: 1px solid #eef2f7;
  }

  .back-to-top,
  .back-link {
    display: none;
  }
}

.resume-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 6rem;
}

@media (max-width: 768px) {
  .resume-content {
    padding: 2rem 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1200px) {
  .resume-content {
    padding: 3rem 4rem;
  }
}
</style>
