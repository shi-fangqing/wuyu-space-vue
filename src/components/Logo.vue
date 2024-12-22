<script setup>
defineProps({
  size: {
    type: String,
    default: 'medium' // small, medium, large
  }
})
</script>

<template>
  <div :class="['logo-wrapper', size]">
    <div class="logo">
      <div class="text-container">
        <span class="dancing-text">
          <span class="char">勿</span>
        </span>
        <span class="dancing-text">
          <span class="char">语</span>
        </span>
        <div class="ink-drops">
          <span class="ink-drop"></span>
          <span class="ink-drop"></span>
        </div>
      </div>
      <div class="decorative-line"></div>
      <div class="chinese-seal">空间</div>
    </div>
  </div>
</template>

<style scoped>
.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.text-container {
  position: relative;
  display: flex;
  gap: 4px;
}

/* 大小变体 */
.small {
  font-size: 1.2rem;
}

.medium {
  font-size: 1.8rem;
}

.large {
  font-size: 2.4rem;
}

/* 主文字样式 */
.text-wu, .text-yu {
  position: relative;
  font-family: "Ma Shan Zheng", cursive;
  font-weight: normal;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

/* 水墨效果 */
.text-wu::before, .text-yu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #8bb8ff 0%,
    #5c6ac4 50%,
    #4cc9f0 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  mix-blend-mode: soft-light;
}

/* 装饰线条 */
.decorative-line {
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  margin: 4px 0;
  transform: scaleX(0.8);
  opacity: 0.5;
}

/* 印章效果 */
.chinese-seal {
  font-family: "Zhi Mang Xing", cursive;
  font-size: 0.6em;
  color: #ff8b8b;
  opacity: 0.9;
  transform: rotate(-5deg);
  position: absolute;
  right: -1.5em;
  bottom: -0.5em;
  text-shadow: 0 1px 4px rgba(0,0,0,0.2);
}

/* 水墨滴落效果 */
.ink-drops {
  position: absolute;
  top: -5px;
  right: -15px;
}

.ink-drop {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0;
  transform-origin: center bottom;
  box-shadow: 0 0 8px rgba(139, 184, 255, 0.4);
}

.ink-drop:nth-child(1) {
  animation: inkDrop 3s infinite;
}

.ink-drop:nth-child(2) {
  animation: inkDrop 3s infinite 1.5s;
}

@keyframes inkDrop {
  0% {
    opacity: 0;
    transform: scale(1) translateY(0);
  }
  20% {
    opacity: 0.6;
    transform: scale(1.2) translateY(5px);
  }
  60% {
    opacity: 0;
    transform: scale(0.8) translateY(15px);
  }
  100% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
}

/* 悬浮效果增强 */
.logo:hover .text-wu::before,
.logo:hover .text-yu::before {
  opacity: 0.6;
}

.logo:hover .decorative-line {
  transform: scaleX(1);
  opacity: 0.8;
}

.logo:hover .chinese-seal {
  transform: rotate(0deg);
  color: #ff6b6b;
}

/* 添加媒体查询确保在小屏幕上显示正常 */
@media (max-width: 768px) {
  .chinese-seal {
    font-size: 0.5em;
    right: -1em;
  }
  
  .decorative-line {
    transform: scaleX(0.6);
  }
}

.dancing-text {
  position: relative;
  display: inline-block;
}

.char {
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  position: relative;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  font-family: "Ma Shan Zheng", cursive;
}

.dancing-text:nth-child(2) .char {
  animation-delay: 0.2s;
}

/* 漂浮动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-4px) rotate(2deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(4px) rotate(-2deg);
  }
}

/* 悬浮效果增强 */
.logo:hover .char {
  animation: dance 1s ease-in-out infinite;
}

/* 跳舞动画 */
@keyframes dance {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  25% {
    transform: translateY(-6px) rotate(5deg) scale(1.1);
  }
  50% {
    transform: translateY(0) rotate(-5deg) scale(1);
  }
  75% {
    transform: translateY(6px) rotate(5deg) scale(1.1);
  }
}

/* 水墨效果增强 */
.dancing-text::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    #8bb8ff 0%,
    #5c6ac4 50%,
    #4cc9f0 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  mix-blend-mode: soft-light;
  border-radius: 50%;
  filter: blur(8px);
}

.logo:hover .dancing-text::before {
  opacity: 0.8;
  animation: glow 2s ease-in-out infinite;
}

/* 发光动画 */
@keyframes glow {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

/* 装饰线条动画增强 */
.decorative-line {
  position: relative;
  overflow: hidden;
}

.decorative-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  animation: shine 3s infinite;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}
</style>