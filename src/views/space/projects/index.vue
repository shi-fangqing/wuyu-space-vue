<template>
  <div class="projects">
    <div class="project-grid">
      <div v-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">📂</div>
        <h3>暂无项目</h3>
        <p>敬请期待更多精彩项目...</p>
      </div>
      
      <div v-else v-for="project in projects" :key="project.id" class="project-card">
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
import { ref, onMounted } from 'vue'
import { loadProjects } from '@/utils/markdown'

const projects = ref([])

onMounted(async () => {
  projects.value = await loadProjects()
})
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

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  grid-column: 1 / -1;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: #1a2a43;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
}
</style> 