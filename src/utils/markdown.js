import fm from 'front-matter'
import MarkdownIt from 'markdown-it'

// 创建 markdown-it 实例并配置
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
})

// 自定义图片渲染规则
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
  const srcIndex = token.attrIndex('src')
  const src = token.attrs[srcIndex][1]
  const alt = token.content || ''
  
  // 处理图片路径
  let imgSrc = src
  if (src.startsWith('@/')) {
    try {
      // 使用动态导入处理图片
      const imagePath = src.replace('@/', '')
      const imageModule = new URL(`../assets/${imagePath}`, import.meta.url)
      imgSrc = imageModule.href
    } catch (error) {
      console.warn(`Failed to load image: ${src}`, error)
      imgSrc = src
    }
  }

  return `<img src="${imgSrc}" alt="${alt}" loading="lazy">`
}

// 加载文章列表
export async function loadArticles() {
  const articles = []
  const articleFiles = import.meta.glob('@/assets/file/articles/*.md', { 
    as: 'raw',
    eager: false  // 改为动态导入
  })
  
  for (const path in articleFiles) {
    const content = await articleFiles[path]() // 动态加载内容
    const { attributes } = fm(content)
    const id = path.split('/').pop().replace('.md', '') // 获取文件名作为id
    articles.push({
      id,
      ...attributes
    })
  }
  
  // 按日期排序
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 加载项目列表
export async function loadProjects() {
  const projects = []
  const projectFiles = import.meta.glob('@/assets/file/projects/*.md', { 
    as: 'raw',
    eager: false
  })
  
  for (const path in projectFiles) {
    const content = await projectFiles[path]()
    const { attributes } = fm(content)
    const id = path.split('/').pop().replace('.md', '')
    projects.push({
      id,
      ...attributes
    })
  }
  
  return projects
}

// 加载单个文章内容
export async function loadArticle(id) {
  try {
    const content = await import(`@/assets/file/articles/${id}.md?raw`)
    const { attributes, body } = fm(content.default || content)
    return {
      ...attributes,
      content: md.render(body) // 使用配置好的 markdown-it 实例
    }
  } catch (error) {
    console.error('Error loading article:', error)
    throw new Error('文章加载失败')
  }
} 