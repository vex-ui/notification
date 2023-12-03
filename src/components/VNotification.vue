<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useTimer } from '@/composables'

//----------------------------------------------------------------------------------------------------
// 📌 component meta
//----------------------------------------------------------------------------------------------------

const p = withDefaults(
  defineProps<{
    duration?: number
    persist?: boolean
  }>(),
  {
    duration: 10000,
  }
)

const emit = defineEmits<{
  timerStop: []
  timerStart: []
  timerPause: []
  timerResume: []
}>()

//----------------------------------------------------------------------------------------------------
// 📌 timer
//----------------------------------------------------------------------------------------------------

const NotificationEl = ref<HTMLElement | null>(null)
const timer = !p.persist ? useTimer(p.duration, stopTimer) : undefined

if (timer) {
  onMounted(() => {
    timer?.start()
    emit('timerStart')
  })
}

function stopTimer() {
  timer?.stop()
  emit('timerStop')
}

function pauseTimer() {
  timer?.pause()
  emit('timerPause')
}

function resumeTimer() {
  timer?.resume()
  emit('timerResume')
}

const isMouseInside = ref(false)

useEventListener(NotificationEl, 'mouseenter', () => {
  isMouseInside.value = true
  pauseTimer()
})

useEventListener(NotificationEl, 'mouseleave', () => {
  isMouseInside.value = false
  if (document.activeElement !== NotificationEl.value) {
    resumeTimer()
  }
})

//----------------------------------------------------------------------------------------------------
// 📌 swipe gesture
//----------------------------------------------------------------------------------------------------

let prevX = 0
let initialX = 0
let lastFrame: number | null = null

useEventListener(NotificationEl, 'touchstart', (e: TouchEvent) => {
  pauseTimer()
  initialX = e.touches[0].clientX
})

useEventListener(NotificationEl, 'touchmove', (e: TouchEvent) => {
  // ignore multi fingers touches
  if (e.touches.length !== 1) return
  e.preventDefault()
  e.stopPropagation()

  // TODO: make this code bidirectional
  // Ignore left swipes beyond the initial position
  // reset prevX to prevent jumps
  if (e.touches[0].clientX < initialX) {
    prevX = initialX
    return
  }

  // debounce drag animation
  if (!lastFrame) {
    lastFrame = requestAnimationFrame(() => {
      if (!NotificationEl.value) return

      lastFrame = null
      prevX = e.touches[0].clientX
      const delta = Math.abs(prevX - initialX)
      NotificationEl.value.style.transform = `translateX(${delta}px)`
    })
  }
})

useEventListener(NotificationEl, 'touchend', () => {
  resumeTimer()
  // Ignore left swipes
  if (prevX < initialX) return

  // if the swipe distance is greater than 33% of el width, close
  const delta = Math.abs(prevX - initialX)
  if (delta > Math.floor(NotificationEl.value!.offsetWidth / 3)) {
    stopTimer()
    return
  }

  // otherwise reset the element's position.
  requestAnimationFrame(() => {
    if (NotificationEl.value) {
      NotificationEl.value.style.transform = `translateX(0)`
    }
  })
})

defineExpose({
  stopTimer,
  pauseTimer,
  resumeTimer,
})
</script>

<template>
  <div
    ref="NotificationEl"
    class="text-sm rounded-sm bg-white shadow-sm pointer-events-auto flex shrink-0 items-start gap-2 p-4 w-20rem max-w-[calc(100vw-2rem)] overflow-hidden"
    tabindex="0"
    role="status"
    aria-atomic
    @keydown.esc="stopTimer"
    @focus="pauseTimer"
    @blur="resumeTimer"
  >
    <slot />
  </div>
</template>
