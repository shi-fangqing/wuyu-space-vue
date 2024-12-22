<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'none' // none, leaves, snow
  }
})

const particles = ref([])
const container = ref(null)
let animationFrame = null

// 创建粒子时添加物理属性
const createParticle = () => {
  const x = Math.random() * window.innerWidth
  const isSnow = props.type === 'snow'
  const size = isSnow ? Math.random() * 8 + 12 : Math.random() * 12 + 15
  const baseSpeed = 0.8 // 统一基础下落速度
  const rotation = Math.random() * 360
  const horizontalSpeed = (Math.random() - 0.5) * (isSnow ? 0.8 : 1.2) // 落叶水平速度稍快

  return {
    x,
    y: -50,
    size,
    verticalSpeed: baseSpeed + Math.random() * 0.5,
    horizontalSpeed,
    rotation,
    rotationSpeed: (Math.random() - 0.5) * (isSnow ? 0.5 : 1), // 落叶旋转稍快
    opacity: Math.random() * 0.3 + 0.5,
    acceleration: 0.005 // 统一重力加速度
  }
}

// 更新粒子位置，使用物理运动模型
const updateParticles = () => {
  // 移除超出视窗的粒子
  particles.value = particles.value.filter(p => p.y < window.innerHeight + 100)

  // 减少粒子数量和生成频率
  if (particles.value.length < 25 && Math.random() < 0.05) { // 从40减到25，生成概率从0.08减到0.05
    particles.value.push(createParticle())
  }

  // 更新位置
  particles.value.forEach(p => {
    // 应用重力加速度
    p.verticalSpeed += p.acceleration

    if (props.type === 'leaves') {
      // 落叶的运动：更柔和的摆动
      p.x += Math.sin(p.y / 60) * 0.3 + p.horizontalSpeed * 0.4
      p.rotation += p.rotationSpeed * 0.4
      p.y += p.verticalSpeed * 0.4
    } else if (props.type === 'snow') {
      // 雪花的运动
      p.x += Math.sin(p.y / 50) * 0.2 + p.horizontalSpeed * 0.3
      p.rotation += p.rotationSpeed * 0.3
      p.y += p.verticalSpeed * 0.4
    }

    // 更早开始淡出效果，使消失更自然
    if (p.y > window.innerHeight - 200) {
      p.opacity *= 0.98
    }
  })

  animationFrame = requestAnimationFrame(updateParticles)
}

// 监听类型变化
watch(() => props.type, (newType) => {
  // 清除现有粒子
  particles.value = []
  
  // 如果有动画正在运行，先停止
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  // 如果新类型不是 none，开始动画
  if (newType !== 'none') {
    updateParticles()
  }
}, { immediate: true })

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div class="background-effect" ref="container">
    <template v-if="type === 'leaves'">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle leaf"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          transform: `rotate(${particle.rotation}deg)`,
          opacity: particle.opacity,
          fontSize: `${particle.size}px`
        }"
      >🍁</div>
    </template>
    <template v-if="type === 'snow'">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="particle snowflake"
        :style="{
          left: `${particle.x}px`,
          top: `${particle.y}px`,
          transform: `rotate(${particle.rotation}deg)`,
          opacity: particle.opacity,
          fontSize: `${particle.size}px`
        }"
      >❄</div>
    </template>
  </div>
</template>

<style scoped>
.background-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.particle {
  position: absolute;
  will-change: transform;
  user-select: none;
}

.leaf {
  color: #e17055;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  transition: opacity 0.5s ease; /* 增加过渡时间 */
}

.snowflake {
  color: #a8c0ff;
  text-shadow: 
    0 0 2px rgba(168, 192, 255, 0.8),
    0 0 4px rgba(168, 192, 255, 0.6),
    0 0 6px rgba(168, 192, 255, 0.4);
  filter: 
    drop-shadow(0 2px 4px rgba(168, 192, 255, 0.3))
    drop-shadow(0 0 8px rgba(168, 192, 255, 0.2));
  transition: opacity 0.5s ease;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .particle {
    font-size: 70%;
  }
  
  .snowflake {
    text-shadow: 
      0 0 1px rgba(168, 192, 255, 0.8),
      0 0 2px rgba(168, 192, 255, 0.6);
    filter: drop-shadow(0 1px 2px rgba(168, 192, 255, 0.3));
  }
}
</style> 