import { ref, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'

export default function useSwipeGesture(target: Ref<HTMLElement | null>) {
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

    if (!lastFrame && target.value) {
      lastFrame = requestAnimationFrame(() => {
        lastFrame = null
        prevX = e.touches[0].clientX
        const delta = Math.abs(prevX - initialX)
        target.value!.style.transform = `translateX(${delta}px)`
      })
    }
  }

  const onTouchEnd = () => {
    const delta = Math.abs(prevX - initialX)
    if (delta > Math.floor(target.value!.offsetWidth / 3)) {
      target.value?.dispatchEvent(new Event('swipe'))
      return
    }

    requestAnimationFrame(() => {
      if (target.value) {
        target.value.animate([{ transform: 'translateX(0)' }], {
          duration: 150,
          easing: 'ease-out',
        })
      }
    })
  }

  useEventListener(target.value, 'touchstart', onTouchStart)
  useEventListener(target.value, 'touchmove', onTouchMove)
  useEventListener(target.value, 'touchend', onTouchEnd)
}
