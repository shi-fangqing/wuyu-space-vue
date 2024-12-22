<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import ChatSettings from './ChatSettings.vue'
import aiChatService from '@/utils/AiChat'
import AvatarSelector from './AvatarSelector.vue'
import ImagePreview from './ImagePreview.vue'
import CodePreview from './CodePreview.vue'
import Toast from './Toast.vue'

// 初始化 markdown 解析器
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    const code = md.utils.escapeHtml(str)
    return `
      <div class="code-block">
        <div class="code-header">
          <span class="code-lang">${lang || 'text'}</span>
          <div class="code-actions">
            <button class="code-btn preview-btn" title="预览代码">
              <span class="icon">👁️</span>
              <span class="btn-text">预览</span>
            </button>
            <button class="code-btn copy-btn" data-code="${code}" title="复制代码">
              <span class="icon">📋</span>
              <span class="btn-text">复制</span>
            </button>
          </div>
        </div>
        <pre class="code-content"><code class="language-${lang || 'text'}">${code}</code></pre>
      </div>`
  }
})

// 渲染 markdown 文本
const renderMarkdown = (text) => {
  if (!text) return ''
  return md.render(text)
}

const messages = ref([
  {
    type: 'assistant',
    content: '你好！我是勿语AI助手，有什么我可以帮你的吗？'
  }
])

const inputMessage = ref('')
const chatWindow = ref(null)
const showSettings = ref(false)
const settings = ref({
  model: 'glm-4'
})
const showAvatarSelector = ref(false)
const currentAvatar = ref('🤖')
const previewImage = ref(null)
const pendingImage = ref(null)

// 自动调整文本框高度
const autoResize = async (e) => {
  const textarea = e.target
  // 先将高度设为0，以便重新计算
  textarea.style.height = '0px'
  // 设置高度为内容高度
  const height = textarea.scrollHeight
  // 限制最大高度为100px
  textarea.style.height = Math.min(height, 100) + 'px'
}

// 处理键盘事件
const handleKeydown = async (e) => {
  // 如果按下 Shift + Enter，则在光标位置插入换行符
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    const cursorPosition = e.target.selectionStart
    const textBeforeCursor = inputMessage.value.slice(0, cursorPosition)
    const textAfterCursor = inputMessage.value.slice(cursorPosition)
    inputMessage.value = textBeforeCursor + '\n' + textAfterCursor
    
    // 等待DOM更新后调整高度
    await nextTick()
    autoResize(e)
    
    // 保持光标在插入换行符后的位置
    setTimeout(() => {
      e.target.selectionStart = e.target.selectionEnd = cursorPosition + 1
    })
    return
  }
  
  // 如果只按下 Enter，则发送消息
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() && !pendingImage.value) return

  const userMessage = inputMessage.value

  // 如果有图片，添加图片消息
  if (pendingImage.value) {
    messages.value.push({
      type: 'user',
      content: userMessage || '[图片]',
      image: pendingImage.value.preview
    })
  } else {
    // 添加普通文本消息
    messages.value.push({
      type: 'user',
      content: userMessage
    })
  }

  // 清空输入
  inputMessage.value = ''
  const imageToSend = pendingImage.value
  pendingImage.value = null

  try {
    // 显示加载状态
    const loadingMessage = {
      type: 'assistant',
      content: '思考中...',
      isLoading: true
    }
    messages.value.push(loadingMessage)

    // 获取AI响应
    const response = await aiChatService.sendMessage(userMessage, {
      imageBase64: imageToSend?.base64
    })

    // 替换加载消息为实际响应
    const index = messages.value.indexOf(loadingMessage)
    messages.value[index] = {
      type: 'assistant',
      ...response
    }

  } catch (error) {
    messages.value.push({
      type: 'assistant',
      content: error.message,
      isError: true
    })
  }

  // 滚动到底部
  await nextTick()
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight
  }
}

// 监听设置变化
watch(() => settings.value, (newSettings) => {
  // 如果切换到非图像识别模型，清除待发送的图片
  if (newSettings.model !== 'glm-4v' && pendingImage.value) {
    pendingImage.value = null
  }
}, { deep: true })

// 保存设置
const saveSettings = (newSettings) => {
  // 立即更新本地设置
  settings.value = { ...newSettings }
  
  // 保存到 localStorage
  localStorage.setItem('chatSettings', JSON.stringify(newSettings))
  
  // 更新 AI 服务的设置
  aiChatService.updateSettings(newSettings)
}

// 从localStorage加载设置
const loadSettings = () => {
  const savedSettings = localStorage.getItem('chatSettings')
  if (savedSettings) {
    settings.value = { ...JSON.parse(savedSettings) }
    // 更新AI服务的设置
    aiChatService.updateSettings(settings.value)
  }
}

// 从localStorage加载头像
onMounted(() => {
  const savedAvatar = localStorage.getItem('assistantAvatar')
  if (savedAvatar) {
    currentAvatar.value = savedAvatar
  }
  loadSettings()
})

// 选择头像
const handleAvatarSelect = (avatar) => {
  currentAvatar.value = avatar.emoji
  localStorage.setItem('assistantAvatar', avatar.emoji)
}

// 处理图片上传
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // 转换图片为 base64
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.readAsDataURL(file)
    })

    // 存储待发送的图片
    pendingImage.value = {
      base64,
      preview: URL.createObjectURL(file)
    }

  } catch (error) {
    console.error('Image upload error:', error)
    alert('图片处理失败，请重试')
  }
}

// 修改消息样式以支持图片显示
const MessageContent = {
  props: ['message'],
  template: `
    <div class="content">
      <img v-if="message.image" :src="message.image" class="message-image">
      <div>{{ message.content }}</div>
    </div>
  `
}

// 打开预览
const openPreview = (imageUrl) => {
  previewImage.value = imageUrl
}

// 关闭预览
const closePreview = () => {
  previewImage.value = null
}

// 添加 toast 状态
const toastMessage = ref('')
const showToast = ref(false)

// 显示 toast
const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 修改复制函数
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToastMessage('复制成功')
  } catch (err) {
    console.error('复制失败:', err)
    showToastMessage('复制失败')
  }
}

// 添加代码预览状态
const previewCode = ref(null)
const previewLang = ref('')

// 修改代码块事件处理
const handleCodeBlockAction = (event) => {
  // 找到最近的按钮元素
  const button = event.target.closest('.code-btn')
  if (!button) return

  if (button.classList.contains('copy-btn')) {
    const code = button.dataset.code
    copyToClipboard(code)
  } else if (button.classList.contains('preview-btn')) {
    const codeBlock = button.closest('.code-block')
    const code = codeBlock.querySelector('code').textContent
    const lang = codeBlock.querySelector('.code-lang').textContent
    previewCode.value = code
    previewLang.value = lang
  }
}

// 关闭代码预览
const closeCodePreview = () => {
  previewCode.value = null
  previewLang.value = ''
}
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="header-left">
        <div class="ai-avatar" @click="showAvatarSelector = true">
          <span class="emoji">{{ currentAvatar }}</span>
        </div>
        <div class="header-info">
          <h3>智能助手</h3>
          <span class="status">
            <span class="status-dot"></span>
            在线
          </span>
        </div>
      </div>
      <div class="header-actions">
        <button class="icon-btn" @click="showSettings = true">⚙️</button>
      </div>
    </div>
    
    <div class="chat-messages" ref="chatWindow">
      <div 
        v-for="(message, index) in messages" 
        :key="index"
        :class="['message', message.type]"
      >
        <div class="message-wrapper">
          <div class="avatar">
            <span class="emoji">{{ message.type === 'user' ? '👤' : currentAvatar }}</span>
          </div>
          <div class="message-content">
            <div class="content">
              <!-- 显示视频消息 -->
              <template v-if="message.type === 'video'">
                <div>{{ message.content }}</div>
                <div class="video-container">
                  <video 
                    :src="message.videoUrl" 
                    :poster="message.coverUrl"
                    controls
                    class="message-video"
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              </template>
              <!-- 显示图片消息 -->
              <template v-if="message.type === 'image'">
                <div>{{ message.content }}</div>
                <img 
                  :src="message.url" 
                  class="generated-image" 
                  alt="AI生成的图片"
                  @click="openPreview(message.url)"
                >
              </template>
              <!-- 显示带图片的文本消息 -->
              <template v-else-if="message.image">
                <img 
                  :src="message.image" 
                  class="message-image" 
                  alt="消息图片"
                  @click="openPreview(message.image)"
                >
                <div class="markdown-content" v-html="renderMarkdown(message.content)"></div>
              </template>
              <!-- 显示普通文本消息 -->
              <template v-else>
                <div class="message-actions">
                  <button class="message-btn copy-btn" @click="copyToClipboard(message.content)" title="复制全文">
                    <span class="icon">📋</span>
                    <span class="btn-text">复制全文</span>
                  </button>
                </div>
                <div 
                  class="markdown-content" 
                  v-html="renderMarkdown(message.content)"
                  @click="handleCodeBlockAction"
                ></div>
              </template>
            </div>
            <span class="time">{{ new Date().toLocaleTimeString() }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <div class="input-area">
        <!-- 显示待发送的图片预览 -->
        <div v-if="pendingImage" class="pending-image">
          <img :src="pendingImage.preview" alt="待发送的图片">
          <button class="remove-image" @click="pendingImage = null" title="移除图片">
            ×
          </button>
        </div>
        
        <div class="input-wrapper">
          <div class="textarea-wrapper">
            <textarea 
              v-model="inputMessage"
              @keydown="handleKeydown"
              @input="autoResize"
              :placeholder="settings.model === 'glm-4v' ? (pendingImage ? '请输入您的问题...' : '上传图片或输入问题...') : settings.model.startsWith('cogview') ? '输入图片描述...' : '输入消息... (Shift + Enter 换行)'"
              rows="3"
            ></textarea>
          </div>
          
          <div class="input-actions">
            <!-- 添加图片上传按钮 -->
            <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleImageUpload"
            >
            <button 
              v-if="settings.model === 'glm-4v'"
              class="action-btn upload-btn" 
              @click="$refs.fileInput.click()"
              title="上传图片"
            >
              📷
            </button>
            <button class="action-btn send-btn" @click="sendMessage">
              <svg viewBox="0 0 24 24" class="send-icon">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 设置弹窗 -->
    <ChatSettings
      :show="showSettings"
      :current-settings="settings"
      :onClose="() => showSettings = false"
      :onSave="saveSettings"
    />
    
    <!-- 头像选择器 -->
    <AvatarSelector
      :show="showAvatarSelector"
      :currentAvatar="currentAvatar"
      :onClose="() => showAvatarSelector = false"
      :onSelect="handleAvatarSelect"
    />
    
    <!-- 添加图片预览组�� -->
    <ImagePreview
      :show="!!previewImage"
      :imageUrl="previewImage"
      :onClose="closePreview"
    />
    
    <!-- 添加代码预览组件 -->
    <CodePreview
      :show="!!previewCode"
      :code="previewCode"
      :language="previewLang"
      :onClose="closeCodePreview"
    />
    
    <!-- 添加 Toast 组件 -->
    <Toast 
      :show="showToast"
      :message="toastMessage"
    />
  </div>
</template>

<style scoped>
.chat-container {
  width: 100%;
  height: 600px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all var(--transition-normal) ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.chat-header {
  padding: 1.2rem 1.5rem;
  background: linear-gradient(135deg, #24385b 0%, #1a2a43 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ai-avatar, .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255,255,255,0.2);
}

.ai-avatar img, .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-info h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  font-family: var(--font-display);
}

.status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #4CAF50;
  border-radius: 50%;
  display: inline-block;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: var(--bg-primary);
}

.message {
  margin-bottom: 1.5rem;
}

.message-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 80%;
}

.message.user .message-wrapper {
  flex-direction: row-reverse;
  margin-left: auto;
}

.message.assistant .message-wrapper {
  margin-right: auto;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #f0f2f5;
  border: none;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.content {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  position: relative;
  line-height: 1.4;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
}

.message.assistant .content {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid rgba(92, 106, 196, 0.1);
  box-shadow: var(--shadow-sm);
  border-top-left-radius: 4px;
  margin-right: auto;
}

.message.user .content {
  background: var(--primary-gradient);
  color: var(--text-light);
  box-shadow: var(--shadow-sm);
  border-top-right-radius: 4px;
  margin-left: auto;
}

.time {
  font-size: 0.8rem;
  color: #999;
  margin-top: 0.5rem;
  align-self: flex-end;
}

.message.user .time {
  align-self: flex-start;
}

.message.assistant .time {
  align-self: flex-end;
}

.chat-input {
  padding: 1.2rem;
  background: var(--bg-card);
  border-top: 1px solid rgba(0,0,0,0.05);
}

.input-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.textarea-wrapper {
  flex: 1;
  position: relative;
}

textarea {
  width: 100%;
  min-height: 80px;
  max-height: 200px;
  padding: 1rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  background: var(--bg-primary);
  font-size: 0.95rem;
  line-height: 1.5;
  resize: none;
  outline: none;
  transition: all 0.3s ease;
}

textarea:focus {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(92, 106, 196, 0.1);
}

.input-actions {
  display: flex;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn {
  background: none;
  font-size: 1.2rem;
  opacity: 0.6;
}

.upload-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.send-btn {
  background: var(--primary-gradient);
  color: white;
}

.send-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.send-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transform: rotate(-30deg);
}

.pending-image {
  width: 120px;
  margin-bottom: 0.5rem;
  position: relative;
}

.pending-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 2px solid rgba(92, 106, 196, 0.1);
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

/* 加载状态样式 */
.message.assistant.loading .content {
  opacity: 0.7;
}

.message.assistant.loading .content::after {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-left: 8px;
  border: 2px solid #666;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message-image,
.generated-image {
  max-width: 300px; /* 限制消息中图片的最大宽度 */
  max-height: 300px; /* 限制消息中图片的最大高度 */
  border-radius: 8px;
  margin: 0.5rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  object-fit: contain; /* 保持图片比例 */
}

.message-image:hover,
.generated-image:hover {
  transform: scale(1.02);
}

.video-container {
  max-width: 400px;
  margin: 0.5rem 0;
}

.message-video {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* Markdown 样式 */
.markdown-content {
  line-height: 1.6;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1rem 0 0.5rem;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(p) {
  margin: 0.3rem 0;
}

.markdown-content :deep(p + p) {
  margin-top: 0.5rem;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

.markdown-content :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 0.85em;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
  font-family: var(--font-mono);
}

.markdown-content :deep(pre) {
  margin: 0;
  padding: 0;
  background: none;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: none;
  white-space: pre;
}

.markdown-content :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.7);
}

.markdown-content :deep(a) {
  color: var(--accent-color);
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(table) {
  width: 100%;
  margin: 0.5rem 0;
  border-collapse: collapse;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.markdown-content :deep(th) {
  background-color: rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

/* 暗色主题适配 */
.message.assistant .markdown-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.1);
}

.message.assistant .markdown-content :deep(pre) {
  background-color: rgba(255, 255, 255, 0.1);
}

.message.assistant .markdown-content :deep(blockquote) {
  border-left-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

/* 消息操作按钮 */
.message-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content:hover .message-actions {
  opacity: 1;
}

.message-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  user-select: none;
  -webkit-user-select: none;
}

.message-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.message-btn .icon,
.message-btn .btn-text {
  pointer-events: none;
}

/* 代码块样式 */
.markdown-content :deep(.code-block) {
  position: relative;
  margin: 0.5rem 0;
  background: #1e1e1e;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.markdown-content :deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.markdown-content :deep(.code-lang) {
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.85em;
  text-transform: uppercase;
}

.markdown-content :deep(.code-actions) {
  display: flex;
  gap: 0.5rem;
}

.markdown-content :deep(.code-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85em;
  user-select: none;
  -webkit-user-select: none;
}

.markdown-content :deep(.code-btn:hover) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.markdown-content :deep(.code-content) {
  margin: 0;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.9em;
  line-height: 1.4;
  color: #d4d4d4;
  overflow-x: auto;
  background: #1e1e1e;
  text-align: left;
}

/* 暗色主题适配 */
.message.assistant .markdown-content :deep(.code-block) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style> 