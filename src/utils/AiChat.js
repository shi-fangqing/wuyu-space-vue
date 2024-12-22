// AI聊天服务配置
const AI_CONFIG = {
  chatURL: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  imageURL: 'https://open.bigmodel.cn/api/paas/v4/images/generations',
  videoURL: 'https://open.bigmodel.cn/api/paas/v4/videos/generations',
  videoResultURL: 'https://open.bigmodel.cn/api/paas/v4/async-result',
  apiKey: '0354e07c41d1de92ab9d52e2253a7f52.mrzQnEceXn1j7Cj0',
  maxTokens: 2000
}

// 聊天历史记录类
class ChatHistory {
  constructor() {
    this.messages = []
    this.maxHistory = 10 // 最多保存10条消息
  }

  // 添加消息
  addMessage(role, content, options = {}) {
    const message = {
      role,
      content,
      ...options
    }

    this.messages.push(message)

    // 如果超过最大历史记录数，删除最早的非系统消息
    if (this.messages.length > this.maxHistory + 1) { // +1 是为了保留系统消息
      const systemMessageIndex = this.messages.findIndex(msg => msg.role === 'system')
      if (systemMessageIndex === 0) {
        // 如果第一条是系统消息，从第二条开始删除
        this.messages.splice(1, 1)
      } else {
        // 否��删除第一条
        this.messages.shift()
      }
    }
  }

  // 获取聊天历史
  getHistory() {
    return this.messages
  }

  // 清空历史
  clear() {
    this.messages = []
  }
}

// AI聊天服务类
class AiChatService {
  constructor() {
    this.history = new ChatHistory()
    
    // 从 localStorage 加载设置或使用默认值
    const savedSettings = localStorage.getItem('chatSettings')
    this.settings = savedSettings ? JSON.parse(savedSettings) : {
      model: 'glm-4'
    }

    // 如果有系统消息，初始化时就添加到历史记录
    if (this.settings.systemMessage) {
      this.setSystemMessage(this.settings.systemMessage)
    }

    this.fileInput = null;
    this.initFileInput();
  }

  // 初始化隐藏的文件输入框
  initFileInput() {
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/jpeg,image/png,image/jpg';
    this.fileInput.style.display = 'none';
    document.body.appendChild(this.fileInput);
  }

  // 将图片文件转换为 base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // 移除 Data URL 的前缀，只保留 base64 内容
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  // 打开文件选择器
  openImageSelector() {
    return new Promise((resolve) => {
      this.fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          // 检查文件大小（5MB限制）
          if (file.size > 5 * 1024 * 1024) {
            console.error('图片大小不能超过5MB');
            resolve(null);
            return;
          }
          try {
            const base64 = await this.fileToBase64(file);
            resolve({
              file,
              base64,
              previewUrl: URL.createObjectURL(file)
            });
          } catch (error) {
            console.error('图片转换失败:', error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
        this.fileInput.value = '';
      };
      this.fileInput.click();
    });
  }

  // 设置系统消息
  setSystemMessage(message) {
    // 清空历史记录
    this.history.clear()
    
    // 添加新的系统消息作为第一条消息
    if (message) {
      this.history.messages = [
        { role: 'system', content: message }
      ]
    }
  }

  updateSettings(newSettings) {
    // 检查系统消息是否发生变化
    const systemMessageChanged = newSettings.systemMessage !== this.settings.systemMessage

    this.settings = { ...newSettings }
    // 保存到 localStorage
    localStorage.setItem('chatSettings', JSON.stringify(newSettings))
    
    // 清空历史记录并设置新的系统消息
    this.history.clear()
    
    // 如果有系统消息，添加为第一条消息
    if (this.settings.systemMessage) {
      this.history.messages = [
        { role: 'system', content: this.settings.systemMessage }
      ]
    }
  }

  // 发送消息给AI
  async sendMessage(message, options = {}) {
    try {
      const { imageBase64 } = options;

      // 根据不同模型处理
      if (this.settings.model === 'cogview-3') {
        // 图像生成模型
        return await this.generateImage(message);
      } else if (this.settings.model === 'glm-4v') {
        // 图像理解模型
        return await this.handleImageMessage(message, imageBase64);
      } else if (this.settings.model === 'cogvideox') {
        // 视频生成模型
        return await this.generateVideo(message, imageBase64);
      } else {
        // GLM-4 文本对话
        return await this.handleTextMessage(message);
      }
    } catch (error) {
      console.error('Send Message Error:', error);
      throw error;
    }
  }

  // GLM-4 文本对话
  async handleTextMessage(message) {
    try {
      const requestBody = {
        model: 'glm-4',
        messages: this.history.getHistory().concat([
          {
            role: 'user',
            content: message
          }
        ])
      }

      const response = await fetch(AI_CONFIG.chatURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        type: 'text',
        content: data.choices[0].message.content
      };
    } catch (error) {
      console.error('Text Chat Error:', error);
      throw error;
    }
  }

  // CogView-3 图像生成
  async generateImage(prompt) {
    try {
      const requestBody = {
        model: 'cogview-3',
        prompt,
        n: 1,
        size: '1024x1024'
      }

      const response = await fetch(AI_CONFIG.imageURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Generated image response:', data) // 调试用

      return {
        type: 'image',
        content: '已生成图片：',
        url: data.data[0].url
      }
    } catch (error) {
      console.error('Generate Image Error:', error)
      throw error
    }
  }

  // GLM-4V 图像理解
  async handleImageMessage(message, imageBase64) {
    try {
      const requestBody = {
        model: 'glm-4v',
        messages: this.history.getHistory().concat([
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              },
              {
                type: 'text',
                text: message || '请描述这个图片'
              }
            ]
          }
        ])
      }

      const response = await fetch(AI_CONFIG.chatURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('GLM-4V Response:', data) // 调试用

      return {
        type: 'text',
        content: data.choices[0].message.content,
        image: imageBase64 // 保留原始图片
      }
    } catch (error) {
      console.error('Image Understanding Error:', error)
      throw error
    }
  }

  // 处理图像相关的请求
  async handleImageUpload(imageUrl) {
    try {
      const requestBody = {
        model: this.settings.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              },
              {
                type: 'text',
                text: '请描述这张图片'
              }
            ]
          }
        ]
      }

      const response = await fetch(AI_CONFIG.chatURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error('Handle Image Upload Error:', error)
      throw new Error('图片处���失败，请稍后重试。')
    }
  }

  // 获取聊天建议
  async getSuggestions(context) {
    try {
      // 实现获取聊天建议的逻辑
      return ['您好，需要什么帮助？', '我以为您解答技术问题', '需要代码相关帮助吗？']
    } catch (error) {
      console.error('Get Suggestions Error:', error)
      return []
    }
  }

  // 清空聊天历史
  clearHistory() {
    this.history.clear()
  }

  // 添加发送图片的方法
  async sendImage(formData) {
    try {
      // 发送图片到服务器
      const response = await fetch(`${AI_CONFIG.chatURL}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response

    } catch (error) {
      console.error('Send Image Error:', error)
      throw new Error('图片上传失败，请稍后重试。')
    }
  }

  // 清理资源
  destroy() {
    if (this.fileInput) {
      document.body.removeChild(this.fileInput);
      this.fileInput = null;
    }
  }

  // 生成视频
  async generateVideo(prompt, imageBase64) {
    try {
      // 构建请求参数
      const requestBody = {
        model: 'cogvideox',
        prompt: prompt,
        quality: 'quality',
        with_audio: true,
        fps: 30
      }

      // 如果有图片，添加图片参数
      if (imageBase64) {
        requestBody.image_url = imageBase64
        requestBody.duration = 10
        requestBody.size = '1920x1080'
      }

      // 发送视频生成请求
      const response = await fetch(AI_CONFIG.videoURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AI_CONFIG.apiKey}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // 轮询获取视频生成结果
      const result = await this.pollVideoResult(data.id)

      // 只返回一个视频消息
      return {
        type: 'video',
        content: '',
        videoUrl: result.video_result[0].url,
        coverUrl: result.video_result[0].cover_image_url
      }

    } catch (error) {
      console.error('Generate Video Error:', error)
      throw new Error('视频生成失败，请稍后重试。')
    }
  }

  // 轮询获取视频生成结果
  async pollVideoResult(taskId, maxAttempts = 60, interval = 3000) {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        const response = await fetch(`${AI_CONFIG.videoResultURL}/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        if (result.task_status === 'SUCCESS') {
          return result
        } else if (result.task_status === 'FAIL') {
          throw new Error('视频生成失败')
        }

        // 等待一段时间后继续轮询
        await new Promise(resolve => setTimeout(resolve, interval))
      } catch (error) {
        console.error('Poll Video Result Error:', error)
        throw error
      }
    }

    throw new Error('视频生成超时')
  }
}

// 创建单例实例
const aiChatService = new AiChatService()

export default aiChatService 