<template>
  <div class="about">
    <section class="profile">
      <div class="avatar">
        <img src="@/assets/avatar.png" alt="勿语的头像">
      </div>
      <h1>勿语</h1>
      <p class="title">全栈工程师 | Java & Vue开发者</p>
    </section>

    <section class="intro">
      <h2>关于我</h2>
      <p>热爱编程的全栈开发者，专注于Java后端和Vue前端开发。追求代码质量和用户体验，热衷于学习新技术。</p>
    </section>

    <section class="skills">
      <h2>技术栈</h2>
      <div class="skill-tags">
        <span v-for="skill in skills" :key="skill" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </section>

    <section class="contact">
      <h2>联系方式</h2>
      <div class="contact-info">
        <p><strong>邮箱：</strong>your.email@example.com</p>
        <p><strong>GitHub：</strong>github.com/yourusername</p>
        <p><strong>掘金：</strong>juejin.cn/user/yourusername</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
  'Java', 'Spring Boot', 'Spring Cloud',
  'Vue.js', 'JavaScript', 'HTML/CSS',
  'MySQL', 'Redis', 'RabbitMQ',
  'Docker', 'Linux', 'Git'
])
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

.profile {
  text-align: center;
  margin-bottom: 4rem;
}

.avatar {
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title {
  color: #666;
  font-size: 1.2rem;
}

h2 {
  color: #1a2a43;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #eef2f7;
}

.intro p {
  color: #444;
  line-height: 1.8;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.skill-tag {
  background: #f0f2f5;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  color: #666;
}

.contact-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.contact-info p {
  margin-bottom: 1rem;
}

.contact-info strong {
  color: #1a2a43;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
  
  .skill-tags {
    gap: 0.5rem;
  }
  
  .skill-tag {
    font-size: 0.9rem;
  }
}
</style> 