import { createRouter, createWebHistory } from 'vue-router'
import SpaceLayout from '@/views/space/layout/index.vue'
import SpaceHome from '@/views/space/index/index.vue'
import Resume from '@/views/resume/index.vue'
import { createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/space'
  },
  {
    path: '/space',
    component: SpaceLayout,
    children: [
      {
        path: '',  // 空路径表示默认子路由
        component: SpaceHome
      },
      {
        path: 'articles',
        component: () => import('@/views/space/articles/index.vue')
      },
      {
        path: 'projects',
        component: () => import('@/views/space/projects/index.vue')
      }
    ]
  },
  {
    path: '/resume',  // 新增简历路由
    component: Resume
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 