import { ref } from 'vue'

export function useRipple(event, element) {
  const ripple = document.createElement('span')
  const rect = element.getBoundingClientRect()
  
  ripple.style.left = `${event.clientX - rect.left}px`
  ripple.style.top = `${event.clientY - rect.top}px`
  ripple.classList.add('ripple')
  
  element.appendChild(ripple)
  
  setTimeout(() => {
    ripple.remove()
  }, 1000)
}

export function useParallax(element, strength = 20) {
  const handleMouseMove = (e) => {
    const { left, top, width, height } = element.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    
    element.style.transform = `
      perspective(1000px)
      rotateY(${x * strength}deg)
      rotateX(${-y * strength}deg)
    `
  }
  
  return {
    handleMouseMove
  }
} 