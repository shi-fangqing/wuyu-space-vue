<template>
  <div class="projects">
    <div class="project-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-header">
          <h2>{{ project.name }}</h2>
          <div class="project-links">
            <a :href="project.github" target="_blank" class="link">GitHub</a>
            <a :href="project.demo" target="_blank" class="link">Demo</a>
          </div>
        </div>
        <p class="project-desc">{{ project.description }}</p>
        <div class="tech-stack">
          <span v-for="tech in project.technologies" 
                :key="tech" 
                class="tech-tag"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const projects = ref([
  {
    id: 1,
    name: '易搬家 - 家政服务平台',
    description: '基于Spring Boot + Vue3开发的家政服务平台，提供在线预约、实时跟踪、评价反馈等功能。',
    github: '#',
    demo: '#',
    technologies: ['Vue3', 'Spring Boot', 'MySQL', 'Redis']
  },
  {
    id: 2,
    name: '智能AI助手',
    description: '基于大语言模型的智能对话系统，提供代码编写、问题解答等功能。',
    github: '#',
    demo: '#',
    technologies: ['Vue3', 'Node.js', 'OpenAI API']
  }
])
</script>

<style scoped>
.projects {
  padding: 1rem 2rem;
}

.project-grid {
  display: grid;
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: transform 0.3s;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.project-header h2 {
  color: #1a2a43;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.link {
  color: #5c6ac4;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #f0f2f5;
  transition: background-color 0.3s;
}

.link:hover {
  background: #e4e7eb;
}

.project-desc {
  color: #444;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.tech-stack {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.tech-tag {
  background: #f0f2f5;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .project-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .project-header h2 {
    font-size: 1.1rem;
    margin: 0;
    flex: 1;
    min-width: 200px;
  }

  .project-links {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .link {
    padding: 0.3rem 0.8rem;
    font-size: 0.9rem;
  }

  .project-card {
    padding: 1rem;
  }

  .project-desc {
    margin: 1rem 0;
    font-size: 0.95rem;
    line-height: 1.5;
  }

  .tech-stack {
    margin: 0.8rem 0;
    font-size: 0.9rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .project-header h2 {
    font-size: 1.2rem;
  }

  .project-card {
    padding: 1.5rem;
  }
}
</style> 