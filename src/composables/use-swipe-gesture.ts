import { ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export default function useSwipeGesture() {
  const targetEl = ref<HTMLElement | null>(null)

  let prevX = 0
  let initialX = 0
  let lastFrame: number | null = null

  const onTouchStart = (e: TouchEvent) => {
    initialX = e.touches[0].clientX
  }

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length !== 1) return
    e.preventDefault()
    e.stopPropagation()

    if (e.touches[0].clientX < initialX) {
      prevX = initialX
      return
    }

    if (!lastFrame && targetEl.value) {
      lastFrame = requestAnimationFrame(() => {
        lastFrame = null
        prevX = e.touches[0].clientX
        const delta = Math.abs(prevX - initialX)
        targetEl.value!.style.transform = `translateX(${delta}px)`
      })
    }
  }

  const onTouchEnd = () => {
    const delta = Math.abs(prevX - initialX)
    if (delta > Math.floor(targetEl.value!.offsetWidth / 3)) {
      targetEl.value?.dispatchEvent(new Event('swipe'))
      return
    }

    requestAnimationFrame(() => {
      if (targetEl.value) {
        targetEl.value.animate([{ transform: 'translateX(0)' }], {
          duration: 150,
          easing: 'ease-out',
        })
      }
    })
  }

  const setTarget = (el: HTMLElement) => {
    targetEl.value = el
    useEventListener(targetEl.value, 'touchstart', onTouchStart)
    useEventListener(targetEl.value, 'touchmove', onTouchMove)
    useEventListener(targetEl.value, 'touchend', onTouchEnd)
  }

  return {
    setTarget,
  }
}
