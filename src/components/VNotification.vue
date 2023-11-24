<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMouseInElement } from '@vueuse/core'
import { useTimer, useEventListener } from '@/composables'

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
// we add 300ms to compensate for the lost time during enter transition
const _duration = p.duration + 300
const timer = !p.persist ? useTimer(_duration, onClose) : undefined

// TODO: this is too expensive for its usage
// find a better solution
const { isOutside: isMouseOutside } = useMouseInElement(NotificationEl)

if (timer) {
  onMounted(() => {
    startTimer()
  })
}

function onClose() {
  stopTimer()
}

function onMouseLeave() {
  if (document.activeElement !== NotificationEl.value) {
    resumeTimer()
  }
}

function onBlur() {
  if (isMouseOutside.value) {
    resumeTimer()
  }
}

function startTimer() {
  timer?.start()
  emit('timerStart')
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

//----------------------------------------------------------------------------------------------------
// 📌 swipe gesture
//
// TODO: extract into composable
// TODO: does this work on pc touch screens?
//----------------------------------------------------------------------------------------------------

let initialX = 0
let prevX = 0
let lastFrame: number | null = null

useEventListener(NotificationEl, 'touchstart', (e: TouchEvent) => {
  initialX = e.touches[0].clientX
})

useEventListener(NotificationEl, 'touchmove', (e: TouchEvent) => {
  // ignore multi fingers touches
  if (e.touches.length !== 1) return
  e.preventDefault()
  e.stopPropagation()

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
  // Ignore left swipes
  if (prevX < initialX) return

  // if the swipe distance is greater than 33% of el width, close
  // else reset the element's transform to 0
  const delta = Math.abs(prevX - initialX)
  if (delta > Math.floor(NotificationEl.value!.offsetWidth / 3)) {
    onClose()
    return
  }

  requestAnimationFrame(() => {
    if (NotificationEl.value) {
      NotificationEl.value.animate([{ transform: 'translateX(0)' }], {
        duration: '150ms',
        easing: 'ease-out',
      })
    }
  })
})
</script>

<template>
  <div
    ref="NotificationEl"
    tabindex="0"
    role="status"
    aria-atomic
    @keydown.esc="onClose"
    @mouseenter="pauseTimer"
    @mouseleave="onMouseLeave"
    @focus="pauseTimer"
    @blur="onBlur"
  >
    <slot />
  </div>
</template>
